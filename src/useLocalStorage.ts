import { useEffect, useState } from "react"

// Generic type T, initalValue will return T or a function that returns T
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
    const [value, setValue] = useState<T>(() => {
        const jsonValue = localStorage.getItem(key)
        if (jsonValue === null) {
            if (typeof initialValue === "function") {
                return (initialValue as () => T)()
            } else {
                return initialValue
            }
        } else {
            return JSON.parse(jsonValue)
        }
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    // return the data obtained, with the same type as value and setValue
    return [value, setValue] as [typeof value, typeof setValue]
}

// ERKLÄRUNG
// useLocalStorage kriegt 2 Values immer
// es wird einen  Generic Type (bedeutet dieser ist nicht genau definiert) akzeptieren
// dieser ist :

//     einmal KEy ( der Speicherort in localstorage)
//     einmal der Generic type oder eine funktion die diesen Generic type zuruckgibt
//         (Wegene useState, weil du entweder eine Funktion oder eine Value passen kannst)

//     dann macht man useState das den Generic type T haben wird

//     versuche die daten durch den key aus dem Speicher zu bekommen
//         Wenn diese null sind
//             && wenn initialValue eine function ist (set)
//                 return er ??? (warscheinlich die funtkion zum ändern des States)
//             wenn keine function dann
//                 gibt er die initial value zurück ( setze value auf initalValue)
//         Wenn nicht null
//             dann hole einfach die Daten und setzte value auf die Daten aus dem speicher

// useEffect if value oder key anders dann update localStorage

// ansonsten returne uns die aktuellen daten im speicher
