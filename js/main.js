let wallet = 100;

const vid = document.getElementById('introVid')
const bgVid = document.querySelector('#bgVid')
const button = document.querySelector('#playAgain')
const play = document.querySelector('#playOne')
const left = document.querySelector('#left')
const center = document.querySelector('#center')
const right = document.querySelector('#right')
const cashLoop = document.getElementById('cashLoop')
const cashEnd = document.getElementById('cashEnd')
const frameDuration = 1000 / 30

const rupees = document.querySelectorAll('.rupee');
Array.from(rupees).forEach(element => element.addEventListener('click', moneyMakingGame))

play.addEventListener('click', playAgain);
vid.addEventListener('ended', hideVideo)

function moneyMakingGame(click){
	
	let [one, two, three] = randomRupee();
    assignRupee(one, two, three);
	let prize;

	if(click.target.classList.contains('plusFifty')){
		prize = wallet + 50;
	}
    else if (click.target.classList.contains('plusTwenty')){
		prize = wallet + 20;
	}
    else if (click.target.classList.contains('minusTen')){
		prize = wallet - 10;
	}
    else if (click.target.classList.contains('minusForty')){
		prize = wallet - 40;
	}
	animateCounter(wallet, prize);
	wallet = prize;
	Array.from(rupees).forEach(element => element.removeEventListener('click', moneyMakingGame))
	button.classList.remove('hidden');
	button.addEventListener('click', playAgain);
}

function playAgain() {
	let classes = ['minusTen', 'minusForty', 'plusFifty', 'plusTwenty'];
	stairs();
	Array.from(rupees).forEach(element => {
		for(let i = 0; i < classes.length; i++) {
			if(element.classList.contains(classes[i])) {
				element.classList.remove(classes[i]);
			}
		}
		element.addEventListener('click', moneyMakingGame);
	})
	button.classList.add('hidden');
	play.classList.add('hidden');
	button.removeEventListener('click', playAgain)
}

// REVEALS INTRO VIDEO AND PLAYS IT

function stairs() {
	//this will include stair sound, unhiding the intro animation and playing the animation, hiding it, then starting the loop animation
	vid.classList.remove('hidden');
	vid.play();
}

// HIDES INTRO VIDEO AND STARTS BACKGROUND VIDEO

function hideVideo(){
	vid.classList.add('hidden')
	bgVid.play();
}

// ASSIGN VALUES TO RUPEES

function assignRupee(leftC, centerC, rightC){
	left.classList.add(leftC)
	center.classList.add(centerC)
	right.classList.add(rightC)
}

// CREATE RANDOM VALUES FOR RUPEES

function randomRupee() {
	//this will return an array of three rupee classes which
	let classes = ['minusTen', ['minusTen', 'minusForty'], ['plusFifty', 'plusTwenty']]
	let result = [];
	for(let i = 3; i > 0; i--) {
		let random1 = Math.floor(Math.random()*2)
		if(typeof classes[i-1] === "string") {
			if(random1 === 0) {
				result.push(classes[i-1]);
				classes.splice[i-1, 1];
			}
			else {
				result.unshift(classes[i-1]);
				classes.splice[i-1, 1];
			}
		}
		else {
			let random2 = Math.floor(Math.random()*2);
			if(random1 === 0) {
				result.push(classes[i-1][random2]);
				classes.splice[i-1, 1];
			}
			else {
				result.unshift(classes[i-1][random2]);
				classes.splice[i-1, 1];
			}
		}
	}
	return result;
}

// COUNTER ANIMATION

function animateCounter (wallet, prize) {
cashLoop.volume=0.1;
cashLoop.play();
if (wallet < prize) {  
  
const counter = setInterval( () => {
		wallet++;
		document.querySelector( '#wallet' ).innerHTML = wallet;
  if ( wallet >= prize ) {
			clearInterval( counter );
			cashLoop.pause();
			cashEnd.play();
		}
	}, frameDuration );
}
  else if (wallet > prize) {
    const counter = setInterval( () => {
		wallet--;
		document.querySelector( '#wallet' ).innerHTML = wallet;
  if ( wallet <= prize ) {
			clearInterval( counter );
			cashLoop.pause();
			cashEnd.play();
		}
	}, frameDuration );
  }
};