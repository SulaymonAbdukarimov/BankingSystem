'use strict';
// BANKIST APP
const account1 = {
  owner: 'Sulaymon Abdukarimov',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Bobur Gafurov',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

const welcomeMessage = document.querySelector('.welcome'),
  loginInput = document.querySelector('.login__input--user'),
  loginPassword = document.querySelector('.login__input--pin'),
  loginBtn = document.querySelector('.login__btn'),
  containerApp = document.querySelector('.app'),
  balanceValue = document.querySelector('.balance__value'),
  movementContainer = document.querySelector('.movements'),
  summaryIn = document.querySelector('.summary__value--in'),
  summaryOut = document.querySelector('.summary__value--out'),
  summaryInterest = document.querySelector('.summary__value--interest'),
  sortBtn = document.querySelector('.btn--sort'),
  transferInputTo = document.querySelector('.form__input--to'),
  transferInputAmount = document.querySelector('.form__input--amount'),
  transferBtn = document.querySelector('.form__btn--transfer'),
  loanAmount = document.querySelector('.form__input--loan-amount'),
  loanBtn = document.querySelector('.form__btn--loan'),
  formCloseAccountUser = document.querySelector('.form__input--user'),
  formCloseAccountPin = document.querySelector('.form__input--pin'),
  formCloseAccountBtn = document.querySelector('.form__btn--close'),
  labelDate = document.querySelector('.date')

//Funtion to display Movements

function displayMovements(movements,sort=false){
  movementContainer.innerHTML = '';
  let movs = sort ? movements.slice().sort((a,b)=>a-b) : movements;
  movs.forEach((item,i)=>{
    let type = item > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1}${type}</div>
        <div class="movements__value">${item}€</div>
     </div>
  `;
    movementContainer.insertAdjacentHTML('afterbegin',html);
  })
}

//Calculate Balance
function calculateBalance(acc){
  acc.balance = acc.movements.reduce((a,b) => a + b,0);
  balanceValue.textContent = `${acc.balance.toFixed(2)}€`
}


//DISPLAYING SUMMARY
function displaySummary(acc){
  const input = acc.movements.filter(item => item > 0).reduce((a,b) => a + b,0)
  summaryIn.textContent = `${input.toFixed(2)}€`;
  const output = acc.movements.filter(item=>item<0).reduce((a,b)=>a+b,0);
  summaryOut.textContent = `${output.toFixed(2)}€`;
  const interest = acc.movements.filter(item => item > 0).map(deposit=>(deposit*acc.interestRate)/100).filter((int,i,arr)=>int>=1).reduce((a,b)=>a+b,0);
  summaryInterest.textContent = `${interest.toFixed(2)}€`;
}


//CREATE USER NAME

function createUser(acc){
  acc.forEach((item,i)=>{
    item.username = item.owner.toLowerCase().split(' ').map(name=>name[0]).join('');
  })
}
createUser(accounts)

//CREATING ONE FUNTION TO WORK ALL FUNCTIONS
function updataUI(acc){
  //Funtion to display Movements
  displayMovements(acc.movements)
  //Calculate Balance
  calculateBalance(acc)
  //DISPLAYING SUMMARY
  displaySummary(acc)
}

//EVENTS
let currentAccount;

//LOGIN
loginBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  currentAccount = accounts.find(acc=>acc.username === loginInput.value)
  if(currentAccount?.pin === +loginPassword.value){
    welcomeMessage.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = `${now.getFullYear()}`.padStart(2, 0);
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`

    loginInput.value = loginPassword.value = '';
    loginPassword.blur();

  //  UPDATE UI
    updataUI(currentAccount)
  }
})


//TRANSFER MONEY

transferBtn.addEventListener('click',(e)=>{
  e.preventDefault()
  const amount = +transferInputAmount.value;
  const reciever = accounts.find(item=>item.username === transferInputTo.value)
  transferInputTo.value = transferInputAmount.value = '';
  transferInputAmount.blur()
if(amount > 0 && reciever && currentAccount.balance >= amount && reciever?.username !== currentAccount.username){
  currentAccount.movements.push(-amount);
  reciever.movements.push(amount)
  currentAccount.movementsDates.push(new Date().toISOString());
  reciever.movementsDates.push(new Date().toISOString());

//  UPDATE UI
  updataUI(currentAccount)
}
})

// LOAN

loanBtn.addEventListener('click',(e)=>{
  e.preventDefault();

  const amount = +loanAmount.value;

  if(amount>0&&currentAccount.movements.some(item=>item>=amount *0.1)){
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updataUI(currentAccount)

  }
  loanAmount.value = ''
  loanAmount.blur();
})

//CLOSE ACCOUNT

formCloseAccountBtn.addEventListener('click',(e)=>{
  e.preventDefault()

  if(currentAccount.username === formCloseAccountUser.value && currentAccount.pin === +formCloseAccountPin.value){
    const item = accounts.findIndex(acc=>acc.username===currentAccount.username);

    //Delete
    accounts.splice(item,1);

    //  HIDE
    containerApp.style.opacity = 0;
  }
  formCloseAccountPin.value = formCloseAccountUser.value = '';
  formCloseAccountPin.blur()
})

//SORT
let sorted = false;
sortBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
})