import React from 'react'

export default function wyloguj() {

function wyloguj() {
    sessionStorage.removeItem("token");
    window.location.href = "/start";
};

    return (
        <>
            {wyloguj()}
        </>
    )
}
