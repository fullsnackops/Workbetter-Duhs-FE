/* eslint no-undef: 0 */
import AppConfig from '@/constants/AppConfig'
import { call } from '@/helpers/api'
import AWS from 'aws-sdk'
import { TextEncoder } from 'text-encoding'
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'

AWS.config.region = 'us-east-1'

const poolData = {
    UserPoolId: AppConfig.UserPoolId,
    ClientId: AppConfig.UserPoolAppClientId,
}
const userPool = new CognitoUserPool(poolData)
let cognitoUser
let cognitoPromise = Promise.resolve()
let signupPromise = Promise.resolve()

const subscribers = []
function subscribe(cb) {
    subscribers.push(cb)
}
function notify(err, session) {
    for (const s of subscribers) {
        s(err, session)
    }
}

async function onGoogleUserChange(user) {
    cognitoPromise = cognitoPromise.then(
        () =>
            new Promise(async resolve => {
                if (!user || !user.isSignedIn()) {
                    notify(null, null)
                    return resolve()
                }

                const { id_token } = user.getAuthResponse()
                const profile = user.getBasicProfile()
                const username = await sha256(`google:${user.getId()}:${profile.getEmail()}`)
                // todo do we really need to wait for it?
                // await signupPromise
                try {
                    const authRes = await authenticate(username, id_token, user)
                    notify(null, authRes)
                    resolve(authRes)
                } catch (e) {
                    if (e && e.code === 'UserNotFoundException') {
                        await gapi.auth2.getAuthInstance().signOut()
                    }
                    notify(e)
                    resolve()
                }
            })
    )
}

const googleInitPromise = new Promise(resolve => {
    gapi.load('client:auth2', () => {
        gapi.client
            .init({
                apiKey: AppConfig.googleApiKey,
                clientId: AppConfig.googleClientId,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: 'profile',
            })
            .then(() => {
                gapi.auth2.getAuthInstance().currentUser.listen(onGoogleUserChange)
                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    onGoogleUserChange(gapi.auth2.getAuthInstance().currentUser.get())
                }
                resolve()
            })
    })
})

async function sha256(str) {
    if (!crypto.subtle) throw new Error('Not available in non-secure mode (http)')
    const buffer = new TextEncoder('utf-8').encode(str)
    const hash = await crypto.subtle.digest('SHA-256', buffer)
    return hex(hash)
}

function hex(buffer) {
    const hexCodes = []
    const view = new DataView(buffer)
    for (let i = 0; i < view.byteLength; i += 4) {
        // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
        const value = view.getUint32(i)
        // toString(16) will give the hex representation of the number without padding
        const stringValue = value.toString(16)
        // We use concatenation and slice for padding
        const padding = '00000000'
        const paddedValue = `${padding}${stringValue}`.slice(-padding.length)
        hexCodes.push(paddedValue)
    }

    return hexCodes.join('')
}

function authenticate(Username, idToken, googleUser) {
    const params = new AuthenticationDetails({ Username })
    const _cognitoUser = new CognitoUser({ Username, Pool: userPool })

    return new Promise((resolve, reject) => {
        const cbs = {
            onSuccess: async session => {
                cognitoUser = _cognitoUser
                if (!googleUser.isSignedIn()) {
                    return reject(Error('User is not signed in'))
                }

                const profile = googleUser.getBasicProfile()
                const { payload } = session.idToken
                resolve({
                    token: session.idToken.jwtToken,
                    user: {
                        username: payload['cognito:username'],
                        timezone: payload.zoneinfo,
                        name: profile.getName(),
                        picture: profile.getImageUrl(),
                        email: profile.getEmail(),
                        renewRequired: !!parseInt(payload['custom:renew_required']),
                    },
                })
            },
            onFailure: err => {
                reject(err)
            },
        }
        cbs.customChallenge = ({ USERNAME, type }) => {
            _cognitoUser.sendCustomChallengeAnswer(idToken, cbs)
        }
        _cognitoUser.initiateAuth(params, cbs)
    })
}

const isLoggedIn = async () => {
    try {
        await googleInitPromise
        // const user = gapi.auth2.getAuthInstance().currentUser.get()
        // user && user.isSignedIn() ? resolve(1) : resolve(null)
        return await cognitoPromise
    } catch (e) {
        return null
    }
}

const signUp = async code => {
    return (signupPromise = signupPromise.then(
        () =>
            new Promise(async (resolve, reject) => {
                try {
                    const { errorMessage, errorType, username } = await call('/users', { code }, 'POST')
                    if (errorType || errorMessage) {
                        return reject(new Error(errorMessage || 'Error', errorType))
                    }
                    resolve(username)
                } catch (e) {
                    reject(e)
                }
            })
    ))
}

const signOut = async () => {
    if (cognitoUser) {
        cognitoUser.signOut()
        cognitoUser = null
    }
    await googleInitPromise
    await gapi.auth2.getAuthInstance().signOut()
}

function googleSignIn() {
    return gapi.auth2.getAuthInstance().signIn({ prompt: 'select_account' })
}

function googleGrantOffline(scope) {
    return gapi.auth2.getAuthInstance().grantOfflineAccess({
        scope,
    })
}

export { googleInitPromise, googleSignIn, googleGrantOffline, signOut, signUp, isLoggedIn, subscribe }
