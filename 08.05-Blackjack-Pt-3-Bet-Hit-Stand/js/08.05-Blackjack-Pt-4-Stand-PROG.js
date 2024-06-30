// Lesson 08.04 - PROG

// Blackjack - Pt. 2: ACES ..!
// Handle whether Ace is worth 11 or 1
// If "Ace 11" would bust the hand, Ace counts as 1

// 1. Given: Arrays for making and storing the cards:
const kinds = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'];
const suits = ['Diamonds', 'Hearts', 'Spades', 'Clubs'];
const deck = [];

// 2. Review: Set up a nested for loop that iterates over 
// the kinds and suits arrays:
kinds.forEach(k => {
    suits.forEach(s => {

        // 4. Concatenate the card name and image file names:
        // - name "Queen of Diamonds" corresponds to file "Queen-of-Diamonds.png"
        // let name = `${k} of ${s}`;
        // let file = `${k}-of-${s}.png`;

        // 5. Declare a variable, valu, with an inital value of k;
        // - valu is for storing the numeric value of the card

        // 6. Set the valu property based on the kind of card
        // - the length of the kind string reveals if it is a face card
        // as only "Jack", "Queen", "King" have more than 3 characters
        // ternary: +k returns NaN for "Ace", "Jack", "Queen", "King"
        // let valu = +k ? k : k.length > 3 ? 10 : 11;

        // Review: Each card is an object with 5 properties:
        /* 
            - name: the name of the card: "Jack of Hearts"
            - file: the card file name: "Jack-of-Hearts.png"
            - kind: 2-10, 'Jack', 'Queen', 'King', 'Ace'
            - suit: 'Diamonds', 'Hearts', 'Spades', 'Clubs'
            - valu: numeric value; face card = 10, Ace = 11
        */

        // 7. Declare a card object with the 5properties, the values of which are
        const card = {
            name: `${k} of ${s}`,
            file: `${k}-of-${s}.png`,
            valu: +k ? k : k.length > 3 ? 10 : 11,
            suit: s,
            kind: k,
        };

        // 8. Push the card object into the deck array:
        deck.push(card);
        
    }); // end suits.forEach
}); // end kinds.forEach

// 9. Review: Shuffle (randomize) the deck:
deck.sort(() => Math.random() - 0.5);

// 9B. Shuffle again, using Fisher-Yates:
for(let i = 0; i < deck.length; i++) {
    let temp = deck[i];
    let r = ~~(Math.random() * deck.length);
    deck[i] = deck[r];
    deck[r] = temp;
}

// console.log(deck);

// 10. Review: Make a shoe consisting of 6 decks of cards, using the spread ... operator
const shoe = [...deck, ...deck, ...deck, ...deck, ...deck, ...deck];
// 11. Review: Shuffle (randomize) the shoe:
shoe.sort(() => Math.random() - 0.5);

// 9B. Shuffle again, using Fisher-Yates:
for(let i = 0; i < shoe.length; i++) {
    let temp = shoe[i];
    let r = ~~(Math.random() * shoe.length);
    shoe[i] = shoe[r];
    shoe[r] = temp;
}

console.log(shoe);

// 12. Get the DOM elements:
// - Get the DEAL button and assign a listener for calling the deal function when clicked
const dealBtn = document.getElementById('deal-btn');
dealBtn.addEventListener('click', deal);

// - Get the HIT and STAND buttons, which won't be assigned listeners yet
// - Get the h2, which will be used for outputting prompts ("HIT or STAND?", etc.)
const hitBtn = document.getElementById('hit-btn');
hitBtn.addEventListener('click', hit);

const standBtn = document.getElementById('stand-btn');
standBtn.addEventListener('click', stand);

// 13. Get the divs that hold the player and dealer hands and 
// that display the player and dealer scores
const playerCardsDiv = document.getElementById('player-cards-div');
const dealerCardsDiv = document.getElementById('dealer-cards-div');

const playerScoreSpan = document.getElementById('player-score-span');
const dealerScoreSpan = document.getElementById('dealer-score-span');

// get the prompts / output box
const outH2 = document.querySelector('h2');

// 14. Declare global vars need for keeping track of the deal
// - arrays for holding player and dealer cards 
// variables for keeping score:
// - dealCounter keeps track of total cards dealt
// - vars for player / dealer score
// = vars for player / dealer ACE score
let dealCounter = 0;
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let pAceScore = 0; // player Ace score
let dAceScore = 0; // dealer Ace score

// DEAL
// Now, that we have the shoe, let's deal a hand of Blackjack. We dealt a hand of
// poker in the earlier lesson where we made the deck of cards, BUT this will be
// different: to better emulate game play, we will use setInterval to deal on a 
// 1-second delay between cards
// the deal consists of 2 hands -- player and dealer -- each of whom get 2 cards
// the dealer's second card is dealt face down -- the "hole card"

// 15. Define the deal function:
function deal() {

    // 16. Since this is a new hand, reset the scores and "clear the table"
    // - reset the player and dealer scores
    playerScore = 0;
    dealerScore = 0;
    // - empty the divs that display the cards
    playerCardsDiv.innerHTML = "";
    dealerCardsDiv.innerHTML = "";
    // - clear the text from the output h2
    outH2.innerHTML = "";
    // - empty the arrays that store the player and dealer hands
    playerHand = [];
    dealerHand = [];
    // - reset the dealCounter:
    dealCounter = 0;

    // disable Deal button so it can't be clicked again til hand is over
    dealBtn.classList.toggle('disabled-btn');
    dealBtn.disabled = true;

    // 17. Call the setInterval method with its callback function, set equal to a variable,
    // myInterval, which will be used to clear the interval (stop deal)
    let dealInterval = setInterval(() => {

        // 18. Increment the counter that keeps track of how many card have been dealt
        dealCounter++;

        // 20. Instantiate a new image object to hold the card image
        let pic = new Image();

        // 21. Pop a card object off the shoe array and save it as a new card
        let card = shoe.pop();

        // test Blackjack scenario by replacing dealt card with Ace-Queen:
        // if(dealCounter < 3) { // first card is Ace for both Player and Dealer
        //     card = {
        //         name: 'Ace of Diamonds',
        //         file: 'Ace-of-Diamonds.png',
        //         valu: 11,
        //         suit: 'Diamonds',
        //         kind: 'Ace',
        //     };
        // } else if(dealCounter == 3) { // card 3 is player's 2nd card: 5 -- no Blackjack
        //     card = {
        //         name: '5 of Clubs',
        //         file: '5-of-Clubs.png',
        //         valu: 5,
        //         suit: 'Clubs',
        //         kind: 5,
        //     };
        // } else { // 4th card is dealer's 2nd card: Queen -- BLACKJACK !!
        //     card = {
        //         name: 'Queen of Diamonds',
        //         file: 'Queen-of-Diamonds.png',
        //         valu: 10,
        //         suit: 'Diamonds',
        //         kind: 'Queen',
        //     };
        // }
        
        // 24. Set up an if-else statement to handle the logic for dealing two cards 
        // each to player and dealer, starting with the player.
        // Th if condition uses the % mod operator to check the remainder 
        // when the counter is divided by 2. If the remainder is 1, this is 
        // the 1st or 3rd card, which goes to the player
        if(dealCounter % 2 == 1) {
            // 25. Output the card to the player's div
            pic.style.width = "120px";
            playerCardsDiv.appendChild(pic);
            // 26. Push the card into the player's hand
            playerHand.push(card);
            console.log('playerHand:', playerHand);
            // 27. Increment the player's score
            playerScore += card.valu;
            console.log('playerScore:', playerScore);
            // 27B. Output the player's score:
            playerScoreSpan.textContent = "Player Score: " + playerScore;

            // ** ## ** Eval Aces ** ## **
            // 27C. If player is dealt an Ace, pAceScore goes from 0 to 11
            //      BUT if this is the 2nd Ace, pAceScore goes from 11 to 12
            if(card.kind == "Ace") {
                // if newly dealt is an Ace AND player score is already 22
                // then this is the SECOND Ace, so player was dealt TWO Aces:
                if(playerScore == 22) {
                    pAceScore = 12;
                    playerScore = 12;
                    playerScoreSpan.textContent = "Player Score: " + playerScore;
                    console.log('playerScore:', playerScore);
                    // go into playerHand array, and change 2nd Ace value from 11 to 1:
                    playerHand[1].valu = 1;
                // new card is the FIRST / only Ace: 
                } else {
                    pAceScore = 11;
                    playerScoreSpan.textContent = "Player Score: " + playerScore;
                }
            }

        // 28. Add the else part to handle dealers dealt to the dealer
        } else {
            // 29. Make the dealer cards a bit smaller, to make them appear farther away
            pic.style.width = "105px";
            // 30. Output the card to the dealer's div
            dealerCardsDiv.appendChild(pic);
            // 31. Push the card into the dealer's hand
            dealerHand.push(card);
            console.log('dealerHand:', dealerHand);
            // 32. Update the dealer's score
            dealerScore += card.valu;
            console.log('dealerScore:', dealerScore);
            // 32B. Output "dealer "shows":
            dealerScoreSpan.textContent = "Dealer Shows: " + dealerHand[0].valu;

            // ** ## ** Eval Aces ** ## **
            // 32C. If dealer is dealt an Ace, dAceScore goes from 0 to 11
            //      BUT if this is the 2nd Ace, dAceScore goes from 11 to 12
            if(card.kind == "Ace") {
                // if newly dealt is an Ace AND dealer score is already 22
                // then this is the SECOND Ace, so dealer was dealt TWO Aces:
                if(dealerScore == 22) {
                    dAceScore = 12;
                    dealerScore = 12;
                    console.log('dealerScore:', dealerScore);
                    // go into dealerHand array, and change 2nd Ace value from 11 to 1:
                    dealerHand[1].valu = 1;
                // new card is the FIRST / only Ace: 
                } else {
                    dAceScore = 11;
                }
            }
        }

        // 22. If this is the last card -- the "hole card" -- set the image to the back of the card image
        // 19. If this is the 4th card being dealt, clear the interval (stop the deal)
        if(dealCounter == 4) {
            clearInterval(dealInterval);
            pic.src = "images/cards350px/0-Back-of-Card-Red.png"; 

            // ## ** ## ** ## ** CHECK for BLACKJACK (21) !! ## ** ## ** ## **
            // but only AFTER all 4 cards are out and hands / scores are updated:

            // set up testing scores:
            // playerScore = 21;
            // dealerScore = 20;

            // assess Blackjack, but for better gameplay do so on a delay:
            setTimeout(() => {
                // check if BOTH Player AND Dealer have Blackjack: 
                if(playerScore == 21 && dealerScore == 21) {
                    outH2.textContent = "Dealer and Player BOTH have Blackjack -- it's a PUSH!";
                    // dealer must prove they have Blackjack by revealing hole card:
                    dealerCardsDiv.children[1].src = `images/cards350px/${dealerHand[1].file}`;
                // check if Player ONLY has Blackjack: 
                } else if(playerScore == 21) {
                    outH2.textContent = "You have Blackjack -- you WIN..!";
                // check if Dealer ONLY has Blackjack: 
                } else if(dealerScore == 21) {
                    outH2.textContent = "Dealer has Blackjack -- you LOSE..!";
                    // dealer must prove they have Blackjack by revealing hole card:
                    dealerCardsDiv.children[1].src = `images/cards350px/${dealerHand[1].file}`;
                // no one has Blackjack, so prompt player to Hit or Stand:
                } else {
                    outH2.textContent = "Hit or Stand..?";
                    // enable the Hit and Stand buttons:
                    hitBtn.disabled = false;
                    hitBtn.classList.toggle('disabled-btn');
                    standBtn.disabled = false;
                    standBtn.classList.toggle('disabled-btn');
                }
                // if anyone has Blackjack, game is over, so reactivate Deal btn:
                // but do so on a slight delay:
                setTimeout(() => {
                    // if hit button is still disabled, someone got Blackjack:
                    if(hitBtn.disabled) {
                        // so reactivate the Deal button for a new game:
                        dealBtn.disabled = false;
                        dealBtn.classList.toggle('disabled-btn');
                    }
                }, 2000);
            }, 2000);

        } else { // set source to be of the actual card
            pic.src = `images/cards350px/${card.file}`;        
        }

    }, 1000); // end setInterval

        // 33. Update "Dealer Show"s" once the deal ends--this is not
        // the dealer's score, just the value of the ONE card that IS showing
        // this value equals the dealer's score minus the value of the the hole card

            // 34. Log the dealer's hidden hand and secret score to the console

            // 35. If no one has blackjack, deactivate the DEAL button so that it cannot be clicked again

                // 36. Mute the color of the DEAL button so that it looks unclickable

                // 37. Un-mute the HIT and STAND buttons and set their disabled to false
                // the buttons appearance is handled by removing and adding classes
    
            // 38. Prompt the player to "HIT or STAND?"..for better game play pacing, 
            // do the prompt on a 1.5-second delay with setTimeout

            // 39. Check to see if either the player or dealer have Blackjack
            // Announce Blackjack on 1 second delay; if no one has Blackjack,
            // prompt player to HIT or STAND:
    
            // 40. Set the setInterval timer for the card dealing to repeat every 1 second:

            // 41. Run the file in the browser and click DEAL, being sure to check the 
            // console for the shuffled deck, shuffled shoe and dealer hand / score

} // end deal() func

// define the hit() function which runs when player clicks HIT button
function hit() {
    const card = shoe.pop();
    const pic = new Image();
    pic.src = `images/cards350px/${card.file}`;

    // output card on a delay:
    setTimeout(() => {
        playerCardsDiv.appendChild(pic);
        // check if card is Ace and if so, does it count 11 or 1
        // no matter what, player CANNOT bust on an Ace:
        if(card.kind == "Ace") {
            // if score is already 10 or more, Ace must count 1:
            if(playerScore > 10) {
                card.valu = 1;
                playerScore++;
                pAceScore++;
            } else {
                playerScore += 11;
                pAceScore += 11;
            }
            outH2.textContent = "Player Score: " + playerScore;
        } else { // else card in NOT an Ace, so Player COULD Bust:
            playerScore += card.valu;
            // handle busting and "unbusting" 
            // check if player score is over 21 
            if(playerScore > 21) {
                // check if player has "Ace 11" to "unbust with":
                if(pAceScore > 10) {  // if pAceScore is 10+, then player has an "Ace 11"
                    // reduce player score by 10 -- this "unbusts" the player
                    playerScore -= 10;
                    pAceScore -= 10; // reduce pAceScore by 10
                    outH2.textContent = "Player Score: " + playerScore;
                // player score > 21 BUT no "Ace 11" to "unbust" with, so BUSTED..!
                } else {
                    setTimeout(() => {
                        // announce PLAYER BUSTED
                        outH2.textContent = "Player BUSTED..!";
                        playerScoreSpan.textContent = "Player Score: " + playerScore;
                        // reactivate Deal Btn for a new game
                        dealBtn.disabled = false;
                        dealBtn.classList.toggle('disabled-btn'); 
                        // deactivate Hit/Stand btns for new game
                        hitBtn.disabled = true;
                        hitBtn.classList.toggle('disabled-btn'); 
                        standBtn.disabled = true;
                        standBtn.classList.toggle('disabled-btn'); 
                        return; // return to end / exit function
                    }, 1500); // end of setTimeout()
                } // end inner if-else
            } // end middle if-else
        }  // end outer if-else 
        // The following should only run if player did NOT bust 
        // check all non-bust scenarios: 
        // if player has 21, they're done getting cards:
        if(playerScore == 21) {
            stand(); // play goes to dealer so call stand() func
            hitBtn.disabled = true;
            hitBtn.classList.toggle('disabled-btn'); 
            standBtn.disabled = true;
            standBtn.classList.toggle('disabled-btn');
        } else { // else player has less than 21, so:
            outH2.textContent = "Hit or Stand..?";
        }
        // regardless of whether player has 21 or less:
        // push card into Hand
        playerHand.push(card);
        // update Player Score Span
        playerScoreSpan.textContent = "Player Score: " + playerScore;

    }, 1500); // end big setTimeout()

} // end hit() function

function stand() {

    // turn off the Hit and Stand btns, because player is done:
    hitBtn.disabled = true;
    hitBtn.classList.toggle('disabled-btn'); 
    standBtn.disabled = true;
    standBtn.classList.toggle('disabled-btn');
    console.log("Hello from the stand() function!");
    // player is done so erase Hit or Stand message
    outH2.textContent = "Dealer's turn..";

    setTimeout(() => { 
        
        // reveal the hole card on a slight delay
        dealerCardsDiv.children[1].src = `images/cards350px/${dealerHand[1].file}`;

        // now that dealer's hole card is visible, output Dealer Score
        dealerScoreSpan.textContent = "Dealer Score: " + dealerScore;

        // eval whether the dealer gets another card
        // dealer must hit on 16 OR Soft 17 (17 with an "Ace 11")
        if(dealerScore <= 16 || (dealerScore == 17 && dAceScore > 10)) {

            setTimeout(() => { // give dealer a card on a slight delay

                const card = shoe.pop();
                const pic = new Image();
                pic.style.width = "105px";
                pic.src = `images/cards350px/${card.file}`;
                dealerCardsDiv.appendChild(pic);

                // no matter what, Dealer CANNOT bust on an Ace:
                if(card.kind == "Ace") {
                    // if score is already 10 or more, Ace must count 1:
                    if(dealerScore > 10) {
                        card.valu = 1;
                        dealerScore++;
                        dAceScore++;
                    } else {
                        dealerScore += 11;
                        dAceScore += 11;
                    }
                } else { // else card in NOT an Ace, so Dealer COULD Bust:
                    dealerScore += card.valu;
                    // handle busting and "unbusting" 
                    // check if dealer score is over 21 
                    if(dealerScore > 21) {
                        // check if dealer has "Ace 11" to "unbust with":
                        if(dAceScore > 10) {  // if dAceScore is 10+, dealer has "Ace 11"
                            // reduce dealer score by 10 -- this "unbusts" the dealer
                            dealerScore -= 10;
                            dAceScore -= 10; // reduce dAceScore by 10
                        }
                    }
                }
                // refresh the dealer score to reflect new card
                dealerScoreSpan.textContent = "Dealer Score: " + dealerScore;
                dealerHand.push(card); // push new card into dealerHand array
                console.log('dealerHand:', dealerHand);

                // call stand function recursively, to see if dealer gets another card
                stand();
                return;

            }, 1250);

        // end if dealerScore is 16 or Soft 17 (so gets another card) 
        // else runs if dealer does not get yet another card 
        // dealer MAY have already BUSTED on card just received
        // so check for bust, and if so annouce DEALER BUSTED
        // else dealer did NOT, so .. let's see who won:   
        } else {
            // dealer is done -- score is 17+, BUT might be BUSTED so check:
            setTimeout(() => {

                if(dealerScore > 21) {
                    outH2.textContent = "Dealer BUSTED -- You WIN..!";
                } else {
                    outH2.textContent = "Who won..?";
                    evalWinner();
                }

            }, 1000);
            return;
        }

    }, 1250);

} // end stand()

// this function only runs if player and dealer and both done and no one busted:
function evalWinner() {
    
    setTimeout(() => {
        console.log('Hello from evalWinner()');
        // there are 3 possible outcomes: player won, dealer won or it's a push (tie)
        if(playerScore == dealerScore) {
            outH2.textContent = "It's a PUSH..!";
        } else if(playerScore > dealerScore) {
            outH2.textContent = "You WIN -- Congrats..!";
        } else {
            outH2.textContent = "You LOSE -- Sorry..!";
        }

        // after another delay, turn on Deal btn
        setTimeout(() => {
            dealBtn.disabled = false;
            dealBtn.classList.toggle('disabled-btn'); 
        }, 1000);

    }, 1250);
 
} // end evalWinner()
 
// END: Lesson 08.05
// NEXT: Lesson 08.05