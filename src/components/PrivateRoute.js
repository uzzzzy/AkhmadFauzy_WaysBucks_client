import React from 'react'
import { Route, Redirect } from 'react-router-dom'

export default function PrivateRoute({ role: status, user, component: Component, ...rest }) {
    const role = status ? status : 'customer'
    return (
        <Route
            {...rest}
            render={() => {
                if (user?.status === role) {
                    return <Component {...rest} />
                } else {
                    return <Redirect to="/" />
                }
            }}
        />
    )
}
