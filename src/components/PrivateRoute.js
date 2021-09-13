import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default function PrivateRoute({ role: status, user, component: Component, ...rest }) {
    const role = status ? status : 'customer'

    // if (localStorage.token && !user) return 'wait user'
    // else if (user) return user.email
    // else return 'no token'

    return (
        <Route
            {...rest}
            render={() => {
                if (localStorage.token && !user) return 'loading'
                else if (user?.status === role) {
                    return <Component user={user} {...rest} />
                } else {
                    return <Redirect to="/" />
                }
            }}
        />
    )
}
