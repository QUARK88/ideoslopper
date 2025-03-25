function getElements() {
    const handler = {
        get: function (_, prop) {
            return document.getElementById(prop)
        }
    }
    return new Proxy({}, handler)
}
const { home, matches, screenshot, match, flag, quote, lSwitch, rSwitch } = getElements()
let ideologies, list
selectedIdeology = ""
document.addEventListener("DOMContentLoaded", async function () {
    (async function () {
        try {
            const [ideologiesResponse] = await Promise.all([
                fetch("./ideologies.json")
            ])
            ideologies = await ideologiesResponse.json()
            for (x in ideologies) {
                const option = document.createElement("option")
                option.innerHTML = x
                matches.appendChild(option)
            }
            list = Object.keys(ideologies)
            matches.addEventListener("change", function () {
                if (matches.selectedIndex > 0) {
                    r("tree", matches.options[matches.selectedIndex].text)
                }
            })
            r("tree", Object.keys(ideologies)[0])
        } catch (error) {
            console.error("Error fetching resources:", error)
        }
    })()
})
function s(ideology) {
    selected = list.indexOf(ideology)
    lSwitch.style.display = "flex"
    rSwitch.style.display = "flex"
    if (selected > 0) {
        lSwitch.onclick = () => r("tree", list[selected - 1])
    } else {
        lSwitch.onclick = () => r("tree", list[list.length - 1])
    }
    if (selected < list.length - 1) {
        rSwitch.onclick = () => r("tree", list[selected + 1])
    } else {
        rSwitch.onclick = () => r("tree", list[0])
    }
}
function r(p, ideology) {
    selectedIdeology = ideology
    match.innerText = ideology
    flag.src = `./assets/flags/${ideology}.svg`
    quote.innerText = ideologies[ideology][0] || "No quote"
    author.innerText = ideologies[ideology][1] || "No author"
    if (p === "tree") {
        s(ideology)
    } else {
        lSwitch.style.display = rSwitch.style.display = "none"
        resultsBack.onclick = p || (() => show("home"))
    }
    screenshot.scrollIntoView({ behavior: "instant" })
}
document.addEventListener("keydown", event => {
    const key = event.key
    const selected = list.indexOf(selectedIdeology)
    if (key === "ArrowLeft") {
        r("tree", list[selected > 0 ? selected - 1 : list.length - 1])
    } else if (key === "ArrowRight") {
        r("tree", list[selected < list.length - 1 ? selected + 1 : 0])
    }
})