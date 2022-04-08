/* eslint no-undef: 0 */
import AppConfig from '@/constants/AppConfig'
import { call } from '@/helpers/api'

let signupPromise = Promise.resolve()
let loginPromise = Promise.resolve()

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
    loginPromise = loginPromise.then(
        () =>
            new Promise(async resolve => {
                if (!user || !user.isSignedIn()) {
                    notify(null, null)
                    return resolve()
                }

                // const { id_token } = user.getAuthResponse()
                const profile = user.getBasicProfile()
                const email = profile.getEmail()
                const password = `google:${user.getId()}:${email}`
                try {
                    const { message, errors, user, token } = await call('/auth/login', { email, password }, 'POST')
                    if (errors && errors.length) {
                        const e = new Error(message || 'Error')
                        notify(e)
                        return resolve()
                    }
                    notify(null, { user, token })
                    resolve({ user, token })
                } catch (e) {
                    if (e && (e === 'Incorrect email or password' || e === 'UserNotFoundException')) {
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

const isLoggedIn = async () => {
    try {
        await googleInitPromise
        // const user = gapi.auth2.getAuthInstance().currentUser.get()
        // user && user.isSignedIn() ? resolve(1) : resolve(null)
        return await loginPromise
    } catch (e) {
        return null
    }
}

const signUp = async code => {
    return (signupPromise = signupPromise.then(
        () =>
            new Promise(async (resolve, reject) => {
                try {
                    const { message, errors, user, token } = await call('/auth/register', { code }, 'POST')
                    if (errors && errors.length) {
                        return reject(new Error(message || 'Error'))
                    }
                    resolve({ user, token })
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
