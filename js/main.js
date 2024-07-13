function loading() {
    $(".loading").fadeOut(500, function () {
        $("body").css("overflow", "visible")
    })
}
// ------------------------------ navbar------------------------------------------

function navOpen_close() {
    let navWidth = $("nav").outerWidth()
    if ($("nav").css("left") == "0px") {
        $("nav").animate({ left: -navWidth }, 500, function () {
            $(".nav-link").animate({ top: 150 }, 1)
        })
        $("#open-close").addClass("fa-bars")
        $("#open-close").removeClass("fa-x")
    }
    else {
        $("nav").animate({ left: 0 }, 500, function () {
            for (let j = 0; j < 5; j++) {
                $(".nav-link").eq(j).animate({ top: 0 }, (j + 5) * 100)
            }
        })
        $("#open-close").removeClass("fa-bars")
        $("#open-close").addClass("fa-x")
    }
}

//----------------------- get all meals & display it ------------------------------------------------

async function getAllMeals() {
    try {
        $("#searchContainer").empty()
        $("#row-cards").html("")
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
        const response = await api.json()
        displayAllMeals(response.meals)
    } catch (error) {
        console.error('Error fetching All Meals:', error);
    }
}

function displayAllMeals(allMeals) {
    let cartona = '';
    for (let i = 0; i < allMeals.length; i++) {
        cartona +=
            `
            <div class="col-md-6 col-lg-3">
                <div class="inner-meals" id="${allMeals[i].idMeal}">
                    <div class="box rounded-2">
                        <img class="w-100" src="${allMeals[i].strMealThumb}">
                        <div class="hid-box d-flex justify-content-start align-items-center ">
                            <h3 class="text-black">${allMeals[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    $("#row-cards").html(cartona)
    $(".inner-meals").click(function () {
        getDetails(this.id)
    })
}
//----------------------- get & display Details -------------------------------------------------------

async function getDetails(id) {
    try {
        $("#row-cards").html("")
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        const response = await api.json()
        displayDetails(response.meals[0])
    } catch (error) {
        console.error('Error fetching Details:', error);
    }
}

function displayDetails(Details) {
    $("#row-search").empty();

    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        if (Details['strIngredient' + i]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${Details['strMeasure' + i]} ${Details['strIngredient' + i]}</li>`;  //-----------------------------------------
        }
    }

    let tags = Details.strTags ? Details.strTags.split(",") : [];
    let tagsStr = tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join('');

    let cartona = `
        <button id="backToAllMeals" class="btn btn-primary">Back To All Meals</button> 
        <div class="col-md-4">
          <div class="inner rounded-3 overflow-hidden">
            <img src="${Details.strMealThumb}" class="w-100" alt="">
            <h2 class="py-4">${Details.strMeal}</h2>
          </div>
        </div>

        <div class="col-md-8">
          <div class="inner">
            <h2>Instructions</h2>
            <p>${Details.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${Details.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${Details.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
             ${ingredients}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsStr}
            </ul>
            <a target="_blank" href="${Details.strSource || '#'}" class="btn btn-success">Source</a>  
            <a target="_blank" href="https://www.youtube.com/watch?v=${Details.strYoutube.split('=')[1]}" class="btn btn-danger">Youtube</a> 
          </div>
        </div>`;

    $("#row-cards").html(cartona);
    $("#backToAllMeals").click(function () {
        $("#row-search").empty();
        getAllMeals();
    });
}

//----------------------- show Search & output -------------------------------------------------------

function showSearchInputs() {
    let cartona = `
              <div class="col-md-6">
            <div class="search">
              <input id="byName" type="text" class="form-control border-white bg-transparent text-white" placeholder="Search By Name">
            </div>
          </div>
          <div class="col-md-6">
            <div class="search">
              <input id="byLetter" type="text" maxlength="1" class="form-control border-white bg-transparent text-white" placeholder="Search By First Letter">

            </div>
          </div>
    `
    $("#row-search").html(cartona)
    $("#row-cards").empty()
    $("#byName").keyup(function () {
        searchByName(this.value)
    })
    $("#byLetter").keyup(function () {
        searchByFLetter(this.value)
    })
}

async function searchByName(inputValue) {
    try {
        $("#row-cards").empty()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
        response = await response.json()

        displayAllMeals(response.meals)
    } catch (error) {
        console.error('Error fetching output:', error);
    }
}
async function searchByFLetter(inputValue) {
    try {
        $("#row-cards").empty()
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${inputValue}`)
        response = await response.json()

        displayAllMeals(response.meals)
    }
    catch {
        console.error('Error fetching output:', error);
    }
}
//----------------------- get , diplay & filter by category --------------------------------------------

async function getCategories() {
    try {
        $(".inner-loading-screen").fadeIn(1);
        $("#row-cards").html("");
        $("#row-search").empty();
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        response = await api.json();
        displayCategories(response.categories);

        $(".inner-loading-screen").fadeOut(300, function () {
            $("body").css("overflow", "visible")
        });

    }
    catch {
        console.error('Error fetching Categories:', error);

    }
}

function displayCategories(meals) {
    let cartona = ``;
    for (let i = 0; i < meals.length; i++) {
        cartona += `
        <div class="col-md-6 col-lg-3">
          <div class="inner meal"id="${meals[i].strCategory}" >
            <div class="box rounded-2">
              <img class="w-100" src="${meals[i].strCategoryThumb}">
              <div class="hid-box d-flex flex-column justify-content-start align-items-center ">
                <h3 class="text-black text-center">${meals[i].strCategory}</h3>
                <p class="text-black text-center">${meals[i].strCategoryDescription}</p>
              </div>
            </div>
          </div>
        </div>
        `
    }
    $("#row-cards").html(cartona);
    $(".meal").click(function () {
        FilterByCategory(this.id)
    })
}
async function FilterByCategory(categoryName) {
    try {
        $(".inner-loading-screen").fadeIn(1);
        $("#row-cards").html("");
        $("#row-search").empty();
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        response = await api.json();
        displayAllMeals(response.meals.slice(0, 20))
        $(".inner-loading-screen").fadeOut(300, function () {
            $("body").css("overflow", "visible")
        });

    }
    catch {
        console.error('Error fetching Meals by Category:', error);

    }
}
//----------------------- get , diplay & filter by Area --------------------------------------------

async function getArea() {
    try {
        $(".inner-loading-screen").fadeIn(1);
        $("#row-cards").html("");
        $("#row-search").empty();
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        response = await api.json();
        displayArea(response.meals)
        $(".inner-loading-screen").fadeOut(300, function () {
            $("body").css("overflow", "visible")
        });

    }
    catch {
        console.error('Error fetching Area:', error);

    }
}

function displayArea(areas) {
    let cartona = ``;
    for (let i = 0; i < areas.length; i++) {
        cartona += `
        <div class="col-md-3">
          <div class="inner Area rounded-2 text-center cursor-pointer p-4 border-1 border-light border" id="${areas[i].strArea}">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3 class="special">${areas[i].strArea}</h3>
          </div>
        </div>
        `
    }
    $("#row-cards").html(cartona);
    $(".Area").click(function () {
        FilterByArea(this.id)

    })
}
async function FilterByArea(areaName) {
    try {
        $(".inner-loading-screen").fadeIn(1);
        $("#row-cards").html("");
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
        response = await api.json();
        displayAllMeals(response.meals.slice(0, 20))

        $(".inner-loading-screen").fadeOut(300, function () {
            $("body").css("overflow", "visible")
        });
    }
    catch {
        console.error('Error fetching Meals by Area:', error);
    }
}
//----------------------- get , diplay & filter by Ingredients ----------------------------------------

async function getIngredients() {
    try {
        $(".inner-loading-screen").fadeIn(1);
        $("#row-cards").html("");
        $("#row-search").empty();
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        response = await api.json();
        displayIngredients(response.meals.slice(0, 20))
        $(".inner-loading-screen").fadeOut(300, function () {
            $("body").css("overflow", "visible")
        });

    }
    catch {
        console.error('Error fetching Ingredients:', error);

    }
}

function displayIngredients(Ingredients) {
    let cartona = ``;
    for (let i = 0; i < Ingredients.length; i++) {
        cartona += `
        <div class="col-md-3" >
                <div class="inner Ingredients rounded-2 text-center cursor-pointer p-4 border-1 border-light border" id="${Ingredients[i].strIngredient}">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3 class="special">${Ingredients[i].strIngredient}</h3>
                        <p>${Ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }
    $("#row-cards").html(cartona);
    $(".Ingredients").click(function () {
        FilterByIngredients(this.id)

    })
}
async function FilterByIngredients(igredientsName) {
    try {
        $(".inner-loading-screen").fadeIn(1);
        $("#row-cards").html("");
        let api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${igredientsName}`);
        response = await api.json();
        displayAllMeals(response.meals.slice(0, 20))

        $(".inner-loading-screen").fadeOut(300, function () {
            $("body").css("overflow", "visible")
        });
    }
    catch {
        console.error('Error fetching Meals by Ingredients:', error);
    }
}
//----------------------- show & validate inputs ----------------------------------------

function showInputs() {
    let cartona = `
                <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
          <div class="container w-75 text-center">
              <div class="row g-4">
                  <div class="col-md-6">
                      <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                      <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                          Special characters and numbers not allowed
                      </div>
                  </div>
                  <div class="col-md-6">
                      <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                      <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                          Email not valid *exemple@yyy.zzz
                      </div>
                  </div>
                  <div class="col-md-6">
                      <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                      <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                          Enter valid Phone Number
                      </div>
                  </div>
                  <div class="col-md-6">
                      <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                      <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                          Enter valid age
                      </div>
                  </div>
                  <div class="col-md-6">
                      <input  id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                      <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                          Enter valid password *Minimum eight characters, at least one letter and one number:*
                      </div>
                  </div>
                  <div class="col-md-6">
                      <input  id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                      <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                          Enter valid repassword 
                      </div>
                  </div>
              </div>
              <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
          </div>
      </div>
    `
    $("#row-search").html("")
    $("#row-cards").html(cartona)
    addEventToInputs();
}

function addEventToInputs() {
    $("#nameInput").on("focus", function () {
        $(this).on("input", function () {
            let nameValue = $(this).val();
            if (!isNameValid(nameValue)) {
                $("#nameAlert").removeClass("d-none");
            } else {
                $("#nameAlert").addClass("d-none");
            }
            checkFormValidity();
        });
    });

    $("#emailInput").on("focus", function () {
        $(this).on("input", function () {
            let emailValue = $(this).val();
            if (!isEmailValid(emailValue)) {
                $("#emailAlert").removeClass("d-none");
            } else {
                $("#emailAlert").addClass("d-none");
            }
            checkFormValidity();
        });
    });

    $("#phoneInput").on("focus", function () {
        $(this).on("input", function () {
            let phoneValue = $(this).val();
            if (!isPhoneValid(phoneValue)) {
                $("#phoneAlert").removeClass("d-none");
            } else {
                $("#phoneAlert").addClass("d-none");
            }
            checkFormValidity();
        });
    });

    $("#ageInput").on("focus", function () {
        $(this).on("input", function () {
            let ageValue = $(this).val();
            if (!isAgeValid(ageValue)) {
                $("#ageAlert").removeClass("d-none");
            } else {
                $("#ageAlert").addClass("d-none");
            }
            checkFormValidity();
        });
    });

    $("#passwordInput").on("focus", function () {
        $(this).on("input", function () {
            let passwordValue = $(this).val();
            if (!isPasswordValid(passwordValue)) {
                $("#passwordAlert").removeClass("d-none");
            } else {
                $("#passwordAlert").addClass("d-none");
            }
            checkFormValidity();
        });
    });

    $("#repasswordInput").on("focus", function () {
        $(this).on("input", function () {
            let repasswordValue = $(this).val();
            if (!isRePasswordValid(repasswordValue)) {
                $("#repasswordAlert").removeClass("d-none");
            } else {
                $("#repasswordAlert").addClass("d-none");
            }
            checkFormValidity();
        });
    });
}

function isNameValid(name) {
    let regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
}

function isEmailValid(email) {
    let regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return regex.test(email);
}

function isPhoneValid(phone) {
    let regex = /^(?:\+20)?01[0125][0-9]{8}$/;
    return regex.test(phone);
}

function isAgeValid(age) {
    let regex = /^(1[6-9]|[2-5][0-9]|6[0-5])$/;
    return regex.test(age);
}

function isPasswordValid(password) {
    let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}

function isRePasswordValid(repassword) {
    let password = $("#passwordInput").val();
    return password === repassword;
}

function checkFormValidity() {
    if (
        isNameValid($("#nameInput").val()) &&
        isEmailValid($("#emailInput").val()) &&
        isPhoneValid($("#phoneInput").val()) &&
        isAgeValid($("#ageInput").val()) &&
        isPasswordValid($("#passwordInput").val()) &&
        isRePasswordValid($("#repasswordInput").val())
    ) {
        $("#submitBtn").removeAttr("disabled");
    } else {
        $("#submitBtn").attr("disabled", "disabled");
    }
}

// ------------------------------------ start envents -------------------------------
$(document).ready(function () {
    getAllMeals();
    loading();
    $(".bars").click(navOpen_close);
    $(".nav-link").click(navOpen_close);
    $("#Search").click(showSearchInputs);
    $("#Categories").click(getCategories);
    $("#Area").click(getArea);
    $("#Ingredients").click(getIngredients);
    $("#Contact").click(showInputs);
});