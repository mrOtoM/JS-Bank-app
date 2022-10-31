'use strict';

// DATA
const account1 = {
  owner: 'Oto Machala',
  movements: [100, 200, 300, -500, -123, 10, 650, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-03-28T09:15:04.904Z',
    '2022-08-01T10:17:24.185Z',
    '2022-08-08T14:11:59.604Z',
    '2022-09-26T17:01:17.194Z',
    '2022-09-28T23:36:17.929Z',
    '2022-10-01T10:51:36.790Z',
  ],
};
const account2 = {
  owner: 'Peter Sveter',
  movements: [1100, 5000, -300, -500, -123, 820, -2345],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-03-28T09:15:04.904Z',
    '2022-08-01T10:17:24.185Z',
    '2022-08-08T14:11:59.604Z',
    '2022-09-26T17:01:17.194Z',
    '2022-09-28T23:36:17.929Z',
    '2022-10-01T10:51:36.790Z',
  ],
};
const account3 = {
  owner: 'Maria Kolacova',
  movements: [1200, -200, 530, 210, -550, -340, -150, 1100],
  interestRate: 1.2,
  pin: 3333,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-03-28T09:15:04.904Z',
    '2022-08-01T10:17:24.185Z',
    '2022-08-08T14:11:59.604Z',
    '2022-09-26T17:01:17.194Z',
    '2022-09-28T23:36:17.929Z',
    '2022-10-01T10:51:36.790Z',
    '2022-11-01T10:51:36.790Z',
  ],
};

const account4 = {
  owner: 'Jozef Mak',
  movements: [100, -123, 1030, 210, -55],
  interestRate: 1.2,
  pin: 4444,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-03-28T09:15:04.904Z',
    '2022-08-01T10:17:24.185Z',
    '2022-08-08T14:11:59.604Z',
    '2022-09-26T17:01:17.194Z',
    '2022-09-28T23:36:17.929Z',
    '2022-10-01T10:51:36.790Z',
  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInt = document.querySelector('.summary__value--interest');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.balance__date');
const labelTimer = document.querySelector('.timer');

const btnClose = document.querySelector('.form__btn--close');
const btnLogin = document.querySelector('.login__btn');
const bntTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnSort = document.querySelector('.btn--sort');
const btnInfo = document.querySelector('.btn--info');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const modalInfo = document.querySelector('.modal');
const closeModal = document.querySelector('.close-modal');

//Logic
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; // hide actual value from index.html

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// Show current balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );
  labelBalance.textContent = `${acc.balance}€`;
};

// Incomes and Outcomes and Interest money
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (account.interestRate / 100)) // Edit later
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInt.textContent = `${interest.toFixed(2)}€`;
};

// Username short name
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // display movements
  displayMovements(acc);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};

// Logout Timer
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer); // stop timer
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time = time - 1; // decrease 1s
  };
  let time = 120; // starting time
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Event Handler - Login
let currentAccount, timer;

//-------------------
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// ------------------

// Current balance DATE
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day}/${month}/${year}, ${hour}: ${min}`;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); // stop reload webpage

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //dispaly welocome msg
    labelWelcome.textContent = `welcome back ${
      currentAccount.owner.split('  ')[0]
    }`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    if (timer) clearInterval(timer); // only 1 timer is allow
    timer = startLogOutTimer();
    // update UI
    updateUI(currentAccount);
  }
});

// Evenet handler - transfer
bntTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer Date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());
    // update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    console.log('transfer invalid');
  }
});

// Event handler - loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2000);
  }
  inputLoanAmount.value = '';
});

// Event hanlder - close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete acc
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
});

let sorted = false;

// Event handler - Btn sort
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

const euroToUsd = 1.1;

// transfer eur to usd
const totalDepositUSD = account1.movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);

// Event handler - Btn info

btnInfo.addEventListener('click', function () {
  modalInfo.classList.remove('hidden');
  console.log('ahojj');
});

closeModal.addEventListener('click', function () {
  modalInfo.classList.add('hidden');
});

document.addEventListener('keydown', function (esc) {
  if (esc.key === 'Escape') {
    modalInfo.classList.add('hidden');
  }
});
