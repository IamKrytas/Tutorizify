import React from 'react'

export default function wyloguj() {

function wyloguj() {
    sessionStorage.removeItem("jwtToken");
    window.location.href = "/logowanie";
};

    return (
        <>
            {wyloguj()}
        </>
    )
}
