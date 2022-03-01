// Set the starting wallet value – must be declared here so it's not dependent on a function and can retain value between games
let wallet = 100;

// Set constants for easy use
const vid = document.querySelector('#introVid');
const bgVid = document.querySelector('#bgVid');
const left = document.querySelector('#left');
const center = document.querySelector('#center');
const right = document.querySelector('#right');
const playOne = document.querySelector('#playOne');
const button = document.querySelector('#playAgain');
const cashLoop = document.querySelector('#cashLoop');
const cashEnd = document.querySelector('#cashEnd');
const walletDisplay = document.querySelector('#wallet');
const rupees = document.querySelectorAll('.rupee');

// Set counter animation speed
const frameDuration = 1000/30;

// Set default EventListeners
vid.addEventListener('ended', hideVideo)
playOne.addEventListener('click', playAgain)

// Main game function
function moneyMakingGame (click) {
    // Declare prize to hold new wallet value
    let prize;
    // Declare variables one, two and three and set them equal to the classes in the array returned from randomRupee
    let [one, two, three] = randomRupee();
    // assign those classes to the rupee elements
    assignRupee(one, two, three);
    // Checks the class of the clicked rupee element, then sets prize to the current wallet value plus/minus the awarded amount.
    if (click.target.classList.contains('minusTen')) {
        prize = wallet - 10;
    }
    else if (click.target.classList.contains('minusForty')) {
        prize = wallet - 40;
    }
    else if (click.target.classList.contains('plusTwenty')) {
        prize = wallet + 20;
    }
    else if (click.target.classList.contains('plusFifty')) {
        prize = wallet + 50;
    }
    // Animates the wallet, starting at the current wallet value and ending at prize (current wallet +/- winnings). Wallet is then set to the new value so the value may be retained for the next game
    counterAnimation(wallet, prize)
    wallet = prize;
    // newGame prevents the this function from being run again before the values are reset, and reveals the button to start a new game
    newGame();
}

// A funtion to reset everything but the wallet for the next game
function playAgain() {
    // stairs replays the into animation
    stairs();
    // resetRupee removes the plus/minus classes from the rupee elements
    resetRupee();
    // These lines remove click events from play buttons and hide them at the same time. Since the same function runs when playing for the first time or playing again, it targets both of those buttons
    playOne.removeEventListener('click', playAgain);
    playOne.classList.add('hidden');
    button.removeEventListener('click', playAgain);
    button.classList.add('hidden');
    // This line adds click events to all of the rupee elements
    Array.from(rupees).forEach(element => element.addEventListener('click', moneyMakingGame))
}

// This function sets up the button to play again, while removing click events from the rupee elements so players can't continue to get rupees once they know the values
function newGame() {
    button.classList.remove('hidden');
    button.addEventListener('click', playAgain);
    Array.from(rupees).forEach(element => element.removeEventListener('click', moneyMakingGame));
}

// This function removes the plus/minus classes from each rupee element so they can be reapplied for the next round
function resetRupee() {
    // A list of the classes is created to check against
    let classes = ['minusTen', 'minusForty', 'plusTwenty', 'plusFifty']
    // This function runs for each rupee element: it iterates through the classes array and checks to see if the rupee element has that class. If the element has the class, it is removed.
    Array.from(rupees).forEach(element => {
        for(let i = 0; i < classes.length; i ++) {
            if(element.classList.contains(classes[i])) {
                element.classList.remove(classes[i]);
            }
        }
    })
}

// This function reveals the intro video and plays it
function stairs() {
    vid.classList.remove('hidden');
    vid.play();
}

// This function is set to run when the intro video ends: it hides the intro video, and then it starts the background video
function hideVideo() {
    vid.classList.add('hidden');
    bgVid.play();
}

// This function returns an array of plus/minus class values, following the pattern of the original game as closely a I could figure out
function randomRupee() {
    // An array of classes that also affects how the randomness plays out. The string in the first index will always appear in the final array. Only one value will be chosen from the nested arrays in indices 2 and 3. So there's a 50% chance each of minusTen or minusForty appearing, and also a 50% each for plusTwenty and plusFifty
    let classes = ['minusTen', ['minusTen', 'minusForty'], ['plusTwenty', 'plusFifty']];
    // An empty array is created to hold the chosen values and return them to be assigned rupee elements
    let result = [];
    // This for loop iterates through the array and chooses values for the final array
    for (let i = 0; i < 3; i++) {
        // This first random value is set to return 0 or 1 – this will be used to add the chosen value to end of the beginning of the result array
        let random = Math.floor(Math.random() * 2);
        // This conditional is used to determine if the index contains a string or an array – if it's a string it will add it to the result array
        if(typeof classes[i] === 'string') {
            // If the random value is 0 (50% chance), the value is added to the end of the array
            if(random === 0) {
                result.push(classes[i]);
            }
            // Otherwise, the value is added to the beginning of the array
            else {
                result.unshift(classes[i]);
            }
        }
        // If the index does not contain a string, it must contain an array, so we need something to rnadomly select which value from that array is added to result
        else {
            // A new random value is created that can return either 0 or 1 to select an index from the nested array. We need a separate random value, otherwise the same index would always be added to the same spot of the result array
            let randomArr = Math.floor(Math.random() *2);
            // Now, just as before, the first random value is used to send the chosen index to the end or beginning of the result array
            if(random === 0) {
                result.push(classes[i][randomArr])
            }
            else {
                result.unshift(classes[i][randomArr])
            }
        }
    }
    // Once the function iterates through the classes array and adds values to the result array, result is returned.
    return result;
}

// This function takes three classes and addes them to the left, center and right rupee elements
function assignRupee(one, two, three) {
    left.classList.add(one);
    center.classList.add(two);
    right.classList.add(three);
}

// This function animates the number movement from one value to another, it also activates audio clips to match the animation
function counterAnimation(start, end) {
    // Set the volume of the loop audio clip because it's too loud, then start it
    cashLoop.volume=0.1;
    cashLoop.play();
    // Checks to see if the final value is greater than the starting value (increment time!) or is the final value is lower than the starting value (decrement time)
    if(start < end) {
        // Starts a setInterval function – this will do the same function over and over again with a delay between iterations. The constant the function is set to will be needed to terminate the function.
        const counterID = setInterval(function() {
            // The set interval function adds 1 to the starting value, then it updates the display with that value
            start++;
            walletDisplay.innerText = start;
            // Next, it checks to see if start has reached the endpoint yet, or if it's gone over it as a failsafe.
            if(start >= end) {
                // Once start is equal to or greater than end, the loop audio is stopped, and the ending audio plays
                cashLoop.pause();
                cashEnd.play();
                // Then the interval is cleared to stop the counter
                clearInterval(counterID)
            }
        }, // here the delay of the setInterval function is used to control the speed of the animation
        frameDuration)
    }
    // This conditional runs to do a decrement if the end is lower than the start: the only differences in the code are that it subtracts 1 each iteration, and it checks to see if start <= end as a failsafe
    else if(start > end) {
        const counterID = setInterval(function() {
            start--;
            walletDisplay.innerText = start;
            if(start <= end) {
                cashLoop.pause();
                cashEnd.play();
                clearInterval(counterID);
            }
        }, frameDuration)
    }
}