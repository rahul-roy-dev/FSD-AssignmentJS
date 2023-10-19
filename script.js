// -- CONSTANS --
const MAX_CHARS = 150; 
const BASE_API_URL = 'https://raw.githubusercontent.com/rahul-roy-dev/practicejs/main/';

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtnEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');

const renderFeedbackItem = feedbackItem => {
    // Komponen feedback baru HTML
    const feedbackItemHTML = `
        <li class="feedback">  
        
            <section class="feedback__badge">
            <i class="fa fa-user-circle" aria-hidden="true"></i>
               
            </section>
            <div class="feedback__content"> 
           
                <p class="feedback__course">${feedbackItem.course}</p>
                <p class="feedback__text">${feedbackItem.text}</p> 
                <p class="feedback__letter">Riser - ${feedbackItem.daysAgo === 0 ? 'Today' : `${feedbackItem.daysAgo} days`}</p>
            </div>
              <button class="upvote">
              <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                <span class="upvote__count">${feedbackItem.likes}</span>
            </button>
        </li>
    `;

    // insert new feedback item in list
    feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
};


// -- COUNTER COMPONENT --
 const inputHandler = () => {
    // Menentukan jumlah karakter untuk text feedback
    const maxNrChars = MAX_CHARS;

    // Menentukan jumlah karakter yang sudah di ketik
    const nrCharsTyped = textareaEl.value.length;

    // Menentukan jumlah karakter tersisa yang bisa di ketik
    const charsLeft = maxNrChars - nrCharsTyped;

    // Indikator jumlah karakter yang di tampilkan
    counterEl.textContent = charsLeft;
};

textareaEl.addEventListener('input', inputHandler);


//FORM COMPONENT
const showVisualIndicator = textCheck => {
        const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';
    
        // Menunjukan indikator form Valid
        formEl.classList.add(className);

        setTimeout(() => {
            formEl.classList.remove(className);
        }, 2000);
}


const submitHandler = event => {
    // Mencegah default behavior
    event.preventDefault();

    const text = textareaEl.value;
     // get the selected value from the myCourse select element
     const mycourse = document.querySelector("#myCourse").options[document.querySelector("#myCourse").selectedIndex].text;
    // Kondisi untuk form Valid
    if (text.length >= 5) {
        showVisualIndicator('valid');
        console.log(mycourse)


    } else {
      showVisualIndicator('invalid');

        textareaEl.focus();

        return;
    }

 
    const course = mycourse;
    const badgeLetter = 'F'
    const likes = 0;
    const daysAgo = 0;

    //Render feedback item in list
    const feedbackItem = {
        likes: likes,
        course: course,
        badgeLetter: badgeLetter,
        daysAgo: daysAgo,
        text: text
    };
   renderFeedbackItem(feedbackItem);

    //send feedback item to Github Repo
    fetch(`${BASE_API_URL}/feedbacks.json`, {
        method: 'POST',
        body: JSON.stringify(feedbackItem),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            console.log('Something went wrong')
            return;
        }

        console.log('Successfully submitted')
    }).catch(error => console.log(error));


    // clear textarea
    textareaEl.value = '';

    submitBtnEl.blur();

    // reset counter
    counterEl.textContent = MAX_CHARS;
};

formEl.addEventListener('submit', submitHandler); 


// -- FEEDBACK LIST COMPONENT --
fetch(`${BASE_API_URL}/feedbacks.json`)
    .then(response => response.json())
    .then(data => {
        //Loader halaman feedback
        spinnerEl.remove();
        
         data.feedbacks.forEach(feedbackItem => renderFeedbackItem(feedbackItem));
});


