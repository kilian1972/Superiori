function ricercaBinaria(arr, target) {
    let inizio = 0
    let fine = arr.length - 1

    for (let i=0; inizio <= fine;i++) {
        let medio = Math.floor((inizio + fine) / 2)
        if (arr[medio] == target) {
            return medio;
        } else if (arr[medio] < target) {
            inizio = medio + 1
        } else {
            fine = medio - 1
        }
    }
    return -1
}

function main() {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let target = parseInt(prompt("Inserisci il numero da cercare:"))

    let risultato = ricercaBinaria(arr, target)
    if (risultato != -1) {
        alert("Numero trovato all'indice:"+ risultato)
    } else {
        alert("Numero non trovato nell'array.")
    }
}