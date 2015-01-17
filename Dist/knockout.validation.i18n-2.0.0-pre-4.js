/*=============================================================================
	Author:			Eric M. Barnard - @ericmbarnard								
	License:		MIT (http://opensource.org/licenses/mit-license.php)		
																				
	Description:	Validation Library for KnockoutJS							
	Version:		2.0.0-pre-4											
===============================================================================
*/
/************************************************
* This is an example localization page. All of these
* messages are the default messages for ko.validation
*
* Currently ko.validation does multiple parameter replacement
* on your message (indicated by the {0}, {1}, etc.).
*
* The parameters that you provide in your validation extender
* are what are passed to your message to do the {0}, {1} etc. replacements.
*
* eg: myProperty.extend({ minLength: 5 });
* ... will provide a message of "Please enter at least 5 characters"
* when validated
*
* eg: myProperty.extend({ between: [1, 5] });
* ... will provide a message of "Please enter between 1 and 5 characters"
* when validated
*
* This message replacement obviously only works with primitives
* such as numbers and strings. We do not stringify complex objects
* or anything like that currently.
*/
(function(factory) {
	// Module systems magic dance.
	/*global require,ko,define*/
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		// CommonJS or Node: hard-coded dependency on "knockout-validation"
		factory(require("knockout-validation"));
	} else if (typeof define === "function" && define["amd"]) {
		// AMD anonymous module with hard-coded dependency on "knockout-validation"
		define(["knockout-validation"], factory);
	} else {
		// <script> tag: use the global `ko` object, attaching a `mapping` property
		factory(ko);
	}
}(function(kv) {
  var kvl = kv.localizations;
kvl["bg-BG"] =
{
	required: 'Моля, въведете стойност.',
	min: 'Моля, въведете стойност по-голяма или равна на {0}.',
	max: 'Моля, въведете стойност по-малка или равна на {0}.',
	minLength: 'Моля, въведете поне {0} символа.',
	maxLength: 'Моля, въведете по-малко от {0} символа.',
	pattern: 'Моля, проверете тази стойност.',
	step: 'Стойността трябва да се увеличава с {0}.',
	email: 'Това не е валиден e-mail адрес.',
	date: 'Моля, въведете валидна дата.',
	dateISO: 'Моля, въведете валидна дата.',
	number: 'Моля, въведете число.',
	digit: 'Моля, въведете цифра.',
	phoneUS: 'Моля, въведете валиден телефонен номер.',
	equal: 'Стойностите трябва да са равни.',
	notEqual: 'Моля, изберете различна стойност.',
	unique: 'Моля, убедете се, че стойността е уникална.'
};
;kvl["ca-CA"] =
{
	required: 'Aquest camp es obligatori',
	min: 'Introduir un valor igual o major que {0}',
	max: 'Introduir un valor menor o igual que {0}',
	minLength: 'Ha de tenir un mínim de {0} caràcters',
	maxLength: 'No pot tenir mes de {0} caràcters',
	pattern: 'Si us plau, comproveu aquest campo',
	step: "El valor ha d'incrementar-se en {0}",
	email: 'Aquesta no es una adreça de correu electrònic correcta',
	date: 'Introduir una data correcta',
	dateISO: 'Introduir una data correcta',
	number: 'Ha de ser un nombre',
	digit: 'Introduir un dígit',
	phoneUS: 'Ha de ser un número de telèfon vàlid',
	equal: 'Els valors han de ser iguals',
	notEqual: 'Elegiu un altre valor',
	unique: 'Ha de ser un valor únic'
}
;kvl["cs-CZ"] =
{
	required: 'Toto pole je povinné.',
	min: 'Zadejte číslo větší nebo rovné {0}.',
	max: 'Zadejte číslo menší nebo rovné {0}.',
	minLength: 'Vložte alespoň {0} znaků.',
	maxLength: 'Vložte nejvíce {0} znaků.',
	pattern: 'Zkontrolujte formát pole.',
	step: 'Hodnota musí být násobek {0}.',
	email: 'Neplatná e-mailová adresa.',
	date: 'Zadejte platné datum.',
	dateISO: 'Zadejte platné datum.',
	number: 'Zadejte číslo.',
	digit: 'Zadejte číslice.',
	phoneUS: 'Zadejte platné telefonní číslo.',
	equal: 'Hodnoty musí být stejné.',
	notEqual: 'Vyberte jinou hodnotu.',
	unique: 'Zkontrolujte, zda hodnota je jedinečná.'
};
;kvl["da-DK"] =
{
	required: 'Dette felt er påkrævet.',
	min: 'Angiv en værdi der mindst er {0}.',
	max: 'Angiv en værdi der højst er {0}.',
	minLength: 'Indtast mindst {0} tegn.',
	maxLength: 'Indtast højst {0} tegn.',
	pattern: 'Tjek venligst denne værdi.',
	step: 'Værdien skal stige med {0}',
	email: 'Dette er ikke en gyldig e-mail-adresse',
	date: 'Indtast en gyldig dato',
	dateISO: 'Indtast en gyldig dato',
	number: 'Indtast et tal',
	digit: 'Indtast et ciffer',
	phoneUS: 'Indtast et gyldigt telefonnummer',
	equal: 'Indtast den samme værdi igen.',
	notEqual: 'Indtast en anden værdi.',
	unique: 'Sørg for at værdien er unik.'
};
;kvl["de-DE"] =
{
	required: 'Dieses Feld ist erforderlich.',
	min: 'Bitte geben Sie einen Wert größer oder gleich {0} ein.',
	max: 'Bitte geben Sie einen Wert kleiner oder gleich {0} ein.',
	minLength: 'Bitte geben Sie mindestens {0} Zeichen ein.',
	maxLength: 'Bitte geben Sie nicht mehr als {0} Zeichen ein.',
	pattern: 'Bitte überprüfen Sie diesen Wert.',
	step: 'Der Wert muss um {0} erhöht werden.',
	email: 'Das ist keine gültige Email-Adresse.',
	date: 'Bitte geben Sie ein gültiges Datum ein.',
	dateISO: 'Bitte geben Sie ein gültiges Datum ein.',
	number: 'Bitte geben Sie eine Zahl ein.',
	digit: 'Bitte geben Sie eine Ziffer ein.',
	phoneUS: 'Bitte geben Sie eine gültige Telefonnummer ein.',
	equal: 'Die Werte müssen übereinstimmen.',
	notEqual: 'Bitte wählen Sie einen anderen Wert.',
	unique: 'Bitte stellen Sie sicher, dass der Wert eindeutig ist.'
};
;kvl["el-GR"] =
{
	required: 'Το πεδίο αυτό είναι υποχρεωτικό.',
	min: 'Παρακαλώ εισάγετε μια τιμή μεγαλύτερη ή ίση από {0}.',
	max: 'Παρακαλώ εισάγετε μια τιμή μικρότερη ή ίση από {0}.',
	minLength: 'Παρακαλώ εισάγετε τουλάχιστον {0} χαρακτήρες.',
	maxLength: 'Παρακαλώ εισάγετε το πολύ {0} χαρακτήρες.',
	pattern: 'Παρακαλώ ελέγξτε την τιμή αυτή.',
	step: 'Η τιμή πρέπει να αυξηθεί κατά {0}',
	email: 'Η διεύθυνση email δεν έχει έγκυρη μορφή',
	date: 'Παρακαλώ εισάγετε μια έγκυρη ημερομηνία',
	dateISO: 'Παρακαλώ εισάγετε μια έγκυρη ημερομηνία',
	number: 'Παρακαλώ εισάγετε έναν αριθμό',
	digit: 'Παρακαλώ εισάγετε ένα ψηφίο',
	phoneUS: 'Παρακαλώ εισάγετε έναν σωστό αριθμό τηλεφώνου',
	equal: 'Οι τιμές πρέπει να είναι ίσες',
	notEqual: 'Παρακαλώ επιλέξτε μια άλλη τιμή.',
	unique: 'Παρακαλώ βεβαιωθείτε ότι η τιμή είναι μοναδική.'
};
;kvl["en-US"] =
{
	required: 'This field is required.',
	min: 'Please enter a value greater than or equal to {0}.',
	max: 'Please enter a value less than or equal to {0}.',
	minLength: 'Please enter at least {0} characters.',
	maxLength: 'Please enter no more than {0} characters.',
	pattern: 'Please check this value.',
	step: 'The value must increment by {0}',
	email: 'This is not a proper email address',
	date: 'Please enter a proper date',
	dateISO: 'Please enter a proper date',
	number: 'Please enter a number',
	digit: 'Please enter a digit',
	phoneUS: 'Please specify a valid phone number',
	equal: 'Values must equal',
	notEqual: 'Please choose another value.',
	unique: 'Please make sure the value is unique.'
};
;kvl["es-ES"] =
{
	required: 'Este campo es obligatorio',
	min: 'Por favor, introduzca un valor igual o mayor a {0}',
	max: 'Por favor, introduzca un valor menor o igual a {0}',
	minLength: 'Por favor, introduzca al menos {0} caracteres',
	maxLength: 'Por favor, no introduzca más de {0} caracteres',
	pattern: 'Por favor, compruebe este campo',
	step: 'El valor debe incrementarse por {0}',
	email: 'Este no es una dirección de email correcta',
	date: 'Por favor, introduzca una fecha correcta',
	dateISO: 'Por favor, introduzca una fecha correcta',
	number: 'Por favor, introduzca un número',
	digit: 'Por favor, introduzca un dígito',
	phoneUS: 'Por favor, introduzca un número de teléfono válido para EEUU',
	equal: 'Los valores deben ser iguales',
	notEqual: 'Por favor, elija otro valor',
	unique: 'Por favor, asegurese de que el valor sea único'
};
;kvl["fa-IR"] =
{
	required: 'تکمیل این فیلد اجباری است.',
	min: 'لطفاً مقداری بزرگتر یا برابر {0} وارد نمائید.',
	max: 'لطفاً مقداری کوچکتر یا برابر {0} وارد نمائید.',
	minLength: 'لطفاً حداقل {0} حرف وارد نمائید.',
	maxLength: 'لطفاً حداکثر {0} حرف وارد نمائید.',
	pattern: 'لطفاً یک مقدار معتبر وارد نمائید.',
	step: 'مقدار باید با {0} افزایش پبدا کند.',
	email: 'لطفاً یک آدرس ایمیل معتبر وارد نمائید.',
	date: 'لطفاً یک تاریخ معتبر وارد نمائید.',
	dateISO: 'لطفاً یک تاریخ معتبر وارد نمائید.',
	number: 'لطفاً یک عدد وارد نمائید.',
	digit: 'لطفاً یک عدد وارد نمائید.',
	phoneUS: 'لطفاً یک شماره تماس معتبر وارد نمائید.',
	equal: 'مقدارها باید برابر باشند.',
	notEqual: 'لطفاً یک مقدار دیگر وارد نمائید.',
	unique: 'لطفاً یک مقدار منحصربه فرد وارد نمائید.'
};
;kvl["fr-FR"] =
{
	required: 'Ce champ est obligatoire.',
	min: 'Veuillez saisir une valeur supérieure ou égale à {0}.',
	max: 'Veuillez saisir une valeur inférieure ou égale à {0}.',
	minLength: 'Veuillez saisir au moins {0} caractères.',
	maxLength: 'Veuillez saisir au plus {0} caractères.',
	pattern: 'Veuillez corriger ce champ.',
	step: 'Le pas d\'incrémentation de la valeur doit être de {0}.',
	email: 'Ceci n\'est pas une adresse électronique valide.',
	date: 'Veuillez saisir une date valide.',
	dateISO: 'Veuillez saisir une date (ISO) valide.',
	number: 'Veuillez saisir un nombre.',
	digit: 'Veuillez saisir un chiffre.',
	phoneUS: 'Veuillez saisir un numéro de téléphone valide.',
	equal: 'Les valeurs doivent être égales.',
	notEqual: 'Veuillez saisir une autre valeur.',
	unique: 'Veuillez vérifier que la valeur est unique.'
};
;kvl["he-IL"] =
{
	required: 'שדה נדרש',
	min: 'אנא הכנס ערך גדול יותר או שווה ל- {0}',
	max: 'אנא הכנס ערך קטן יותר או שווה ל- {0}',
	minLength: 'אנא הכנס לפחות {0} תווים',
	maxLength: 'אנא הכנס לא יותר מאשר {0} תווים',
	pattern: 'אנא בדוק את הערך הזה',
	step: 'הערך צריך להשתנות ב - {0}',
	email: 'אנא הכנס כתובת דוא"ל חוקית',
	date: 'אנא הכנס תאריך תקין',
	dateISO: 'אנא הכנס תאריך תקין',
	number: 'אנא הכנס מספר',
	digit: 'אנא הכנס ספרה',
	phoneUS: 'אנא הכנס מספר טלפון תקין',
	equal: 'ערכים חייבים להיות שווים',
	notEqual: 'אנא בחר ערך שונה',
	unique: 'אנא וודא שהערך ייחודי'
};
;kvl["hr-HR"] =
{
	required: 'Ovo polje je obavezno.',
	min: 'Unesena vrijednost mora biti jednaka ili veća od {0}.',
	max: 'Unesena vrijednost mora biti jednaka ili manja od {0}.',
	minLength: 'Minimalna dužina polja je {0} znakova.',
	maxLength: 'Maksimalna dužina polja je {0} znakova.',
	pattern: 'Unesena vrijednost nije ispravnog formata.',
	step: 'Vrijednost se mora povećavati za {0}.',
	email: 'Potrebno je unijeti ispravnu e-mail adresu.',
	date: 'Potrebno je unijeti ispravan datum.',
	dateISO: 'Potrebno je unijeti ispravan datum.',
	number: 'Unesena vrijednost mora biti broj.',
	digit: 'Unesena vrijednost mora biti znamenka.',
	phoneUS: 'Potrebno je unijeti ispravan broj telefona.',
	equal: 'Vrijednosti moraju biti jednake.',
	notEqual: 'Unesite drugu vrijednost.',
	unique: 'Unesena vrijednost mora biti jedinstvena.'
};
;kvl["hu-HU"] =
{
	required: 'Kötelezõ megadni.',
	min: 'Nem lehet kisebb, mint {0}.',
	max: 'Nem lehet nagyobb, mint {0}.',
	minLength: 'Legalább {0} karaktert adjon meg.',
	maxLength: 'Legfeljebb {0} karaktert adjon meg.',
	pattern: 'Kérem ellenõrizze ezt az értéket.',
	step: 'Az értéknek {0} értékkel kell növekednie.',
	email: 'A megadott email cím nem érvényes.',
	date: 'A megadott dátum nem érvényes.',
	dateISO: 'A megadott dátum nem érvényes.',
	number: 'Kérem számot adjon meg.',
	digit: 'Kérem számjegyet adjon meg.',
	phoneUS: 'Kérem, hogy érvényes telefonszámot adjon meg.',
	equal: 'Az értékeknek meg kel egyezniük.',
	notEqual: 'Az értékeknek különbözniük kell.',
	unique: 'Az értéknek egyedieknek kell lennie.'
};
;kvl["it-IT"] =
{
	required: 'Il campo è obbligatorio.',
	min: 'Inserire un valore superiore od uguale a {0}.',
	max: 'Inserire un valore inferiore od uguale a {0}.',
	minLength: 'Inserire almeno {0} caratteri.',
	maxLength: 'Inserire al massimo {0} caratteri.',
	pattern: 'Controllare il valore inserito.',
	step: 'Il valore deve essere incrementato di {0}.',
	email: 'Indirizzo email non valido.',
	date: 'Inserire una data valida.',
	dateISO: 'Inserire una data valida.',
	number: 'Inserire un valore numerico.',
	digit: 'Inserire una cifra.',
	phoneUS: 'Specificare un numero di telefono valido.',
	equal: 'I valori devono essere uguali.',
	notEqual: 'Il valore deve essere differente.',
	unique: 'Il valore deve essere univoco.'
};
;kvl["ja-JP"] =
{
	required: 'このフィールドは必須入力項目です。',
	min: '{0}以上の値を入力してください。',
	max: '{0}以下の値を入力してください。',
	minLength: '{0}文字以上の文字を入力してください。',
	maxLength: '{0}文字以下の文字数にしてください。',
	pattern: '入力値を確認してください。',
	step: 'この値は{0}で増加します。',
	email:'適切なe-mailアドレスではありません。',
	date: '適切な日付を入力してください。',
	dateISO: '適切な日付を入力してください。',
	number: '数字を入力してください。',
	digit: '数値を入力してください。',
	phoneUS: '有効な電話番号を指定してください。',
	equal: '同一の値にしてください。',
	notEqual: '他の値を選択してください。',
	unique: '一意の値であることを確認してください。'
};
;kvl["ko-KR"] =
{
	required: '필수 입력항목입니다.',
	min: '{0}보다 큰 값을 입력해 주십시오.',
	max: '{0}보다 작은 값을 입력해 주십시오.',
	minLength: '{0}글자 이상으로 입력해 주십시오.',
	maxLength: '{0}글자 이하로 입력해 주십시오.',
	pattern: '입력한 값의 형식이 올바르지 않습니다.',
	step: '이 값은 반드시 {0}씩 증가해야 합니다.',
	email:'올바른 이메일 주소 형식이 아닙니다.',
	date: '올바른 날짜 형식이 아닙니다.',
	dateISO: '올바른 날짜 형식이 아닙니다.',
	number: '숫자를 입력해 주십시오.',
	digit: '숫자를 입력해 주십시오.',
	phoneUS: '올바른 전화번호 형식이 아닙니다.',
	equal: '같은 값을 입력해 주십시오.',
	notEqual: '다른 값을 선택해 주십시오.',
	unique: '고유한 값인지 확인해 주십시오.'
};
;kvl["lv-LV"] =
{
	required: 'Lauks ir obligāts.',
	min: 'Lūdzu, ievadiet vērtību lielāku vai vienādu ar {0}.',
	max: 'Lūdzu, ievadiet vērtību mazāku vai vienādu par {0}.',
	minLength: 'Lūdzu, ievadiet vismaz {0} simbolus.',
	maxLength: 'Lūdzu, ievadiet ne vairāk kā {0} simbolus.',
	pattern: 'Lūdzu, pārbaudiet norādītās vērtības formātu.',
	step: 'Norādītām vērtībām jābūt pieaugošām ar soli {0}',
	email: 'Norādītā e-pasta adrese neatbilst formātam',
	date: 'Lūdzu, norādiet atbilstošu datuma formātu.',
	dateISO: 'Lūdzu, norādiet atbilstošu datuma formātu.',
	number: 'Lūdzu, ievadiet numuru.',
	digit: 'Lūdzu, ievadiet ciparu.',
	phoneUS: 'Lūdzu, norādiet formātam atbilstošu telefona numuru.',
	equal: 'Norādītām vērtībām jābūt vienādām.',
	notEqual: 'Norādītās vērtības nav vienādas.',
	unique: 'Vērtībai jābūt unikālai.'
};
;kvl["nl-BE"] =
{
	required: 'Dit veld is verplicht.',
	min: 'Vul een waarde in groter dan of gelijk aan {0}.',
	max: 'Vul een waarde in kleiner dan of gelijk aan {0}.',
	minLength: 'Vul ten minste {0} tekens in.',
	maxLength: 'Vul ten hoogste {0} tekens in.',
	pattern: 'Vul een correcte waarde in.',
	step: 'Vul een waarde in die deelbaar is door {0}.',
	email: 'Vul een correct e-mailadres in.',
	date: 'Vul een correcte datum in.',
	dateISO: 'Vul een correcte datum in.',
	number: 'Vul een getal in.',
	digit: 'Vul een cijfer in.',
	phoneUS: 'Vul een geldig telefoonnummer in.',
	equal: 'Waarden moeten gelijk zijn.',
	notEqual: 'Vul een andere waarde in.',
	unique: 'Vul een unieke waarde in.'
};
;kvl["nl-NL"] =
{
	required: 'Dit veld is verplicht.',
	min: 'Vul een waarde in groter of gelijk aan {0}.',
	max: 'Vul een waarde in kleiner of gelijk aan {0}.',
	minLength: 'Vul ten minste {0} tekens in.',
	maxLength: 'Vul ten hoogste {0} tekens in.',
	pattern: 'Vul een correcte waarde in.',
	step: 'Vul een waarde in die deelbaar is door {0}.',
	email: 'Vul een correct e-mailadres in.',
	date: 'Vul een correcte datum in.',
	dateISO: 'Vul een correcte datum in.',
	number: 'Vul een getal in.',
	digit: 'Vul een cijfer in.',
	phoneUS: 'Vul een geldig telefoonnummer in.',
	equal: 'Waarden moeten gelijk zijn.',
	notEqual: 'Vul een andere waarde in.',
	unique: 'Vul een unieke waarde in.'
};
;kvl["no-NB"] =
{
	required: 'Dette feltet er obligatorisk',
	min: 'Fyll inn en verdi som er større eller lik {0}',
	max: 'Fyll inn en verdi som er mindre eller lik {0}',
	minLength: 'Fyll inn minst {0} tegn',
	maxLength: 'Fyll inn færre enn {0} tegn',
	pattern: 'Vennligst kontrollér verdien',
	step: 'Verdien må økes med {0}',
	email: 'Dette er ikke en korrekt e-postadresse',
	date: 'Fyll inn en korrekt dato',
	dateISO: 'Fyll inn en korrekt dato',
	number: 'Fyll inn ett nummer',
	digit: 'Fyll inn ett siffer',
	phoneUS: 'Vennlist spesifiser ett korrekt telefonnummer',
	equal: 'Verdiene må være like',
	notEqual: 'Vennligst velg en annen verdi',
	unique: 'Vennligst sørg for at verdien er unik'
};
;kvl["pl-PL"] =
{
	required: 'To pole jest wymagane.',
	min: 'Wprowadź liczbę więszką lub równą {0}.',
	max: 'Wprowadź liczbę mniejszą lub równą {0}.',
	minLength: 'Wprowadź co najmniej {0} znaków.',
	maxLength: 'Wprowadź co najwyżej {0} znaków.',
	pattern: 'Sprawdź to pole.',
	step: 'Wartość musi być wielokrotnością {0}.',
	email: 'Wprowadź poprawny adres e-mail.',
	date: 'Wprowadź poprawną datę.',
	dateISO: 'Wprowadź poprawną datę.',
	number: 'Wprowadź liczbę.',
	digit: 'Wprowadź cyfrę.',
	phoneUS: 'Wprowadź poprawny numer telefonu.',
	equal: 'Wartości muszą być równe.',
	notEqual: 'Wybierz inną wartość.',
	unique: 'Sprawdź czy wartość jest unikalna.'
};
;kvl["pt-BR"] =
{
	required: 'Este campo é obrigatório.',
	min: 'Por favor, informe um valor maior ou igual a {0}.',
	max: 'Por favor, informe um valor menor ou igual a {0}.',
	minLength: 'Por favor, informe ao menos {0} caracteres.',
	maxLength: 'Por favor, informe no máximo {0} caracteres.',
	pattern: 'Por favor, verifique este valor',
	step: 'O valor deve ser incrementado por {0}',
	email: 'Por favor, informe um e-mail válido.',
	date: 'Por favor, informe uma data válida.',
	dateISO: 'Por favor, informe uma data válida (ISO).',
	number: 'Por favor, informe um número válido.',
	digit: 'Por favor, utilize somente dígitos.',
	phoneUS: 'Por favor, informe um telefone válido',
	equal: 'Os valores devem ser iguais',
	notEqual: 'Por favor, informe outro valor',
	unique: 'Verifique se o valor é único'
};
;kvl["pt-PT"] =
{
	required: 'Este campo é obrigatório.',
	min: 'Por favor, introduza um valor maior ou igual a {0}.',
	max: 'Por favor, introduza um valor menor ou igual a {0}.',
	minLength: 'Por favor, introduza pelo menos {0} caracteres.',
	maxLength: 'Por favor, introduza no máximo {0} caracteres.',
	pattern: 'Por favor, verifique este valor',
	step: 'O valor deve ser incrementado por {0}',
	email: 'Por favor, introduza um e-mail válido.',
	date: 'Por favor, introduza uma data válida.',
	dateISO: 'Por favor, introduza uma data válida (ISO).',
	number: 'Por favor, introduza um número válido.',
	digit: 'Por favor, utilize somente dígitos.',
	phoneUS: 'Por favor, introduza um telefone válido',
	equal: 'Os valores devem ser iguais',
	notEqual: 'Por favor, introduza outro valor',
	unique: 'Verifique se o valor é único'
};
;kvl["ro-RO"] =
{
	required: 'Acest câmp este obligatoriu.',
	min: 'Introduceţi un număr mai mare sau egal cu {0}.',
	max: 'Introduceţi un număr mai mic sau egal cu {0}.',
	minLength: 'Introduceţi cel puţin {0} caractere.',
	maxLength: 'Introduceţi maxim {0} caractere.',
	pattern: 'Verificaţi această valoare.',
	step: 'Valoarea trebuie să crească cu {0}.',
	email: 'Adresa de email nu este validă.',
	date: 'Vă rugăm introduceţi o dată validă.',
	dateISO: 'Vă rugăm introduceţi o dată validă.',
	number: 'Introduceţi un număr.',
	digit: 'Introduceţi o cifră.',
	phoneUS: 'Vă rugăm să specificați un număr de telefon valid.',
	equal: 'Valorile trebuie să fie egale.',
	notEqual: 'Vă rugăm să alegeți o altă valoare.',
	unique: 'Vă rugăm să vă asigurați că valoarea este unică.'
};
;kvl["ru-RU"] =
{
	required: 'Пожалуйста, заполните это поле.',
	min: 'Пожалуйста, введите число большее или равное {0}.',
	max: 'Пожалуйста, введите число меньшее или равное {0}.',
	minLength: 'Пожалуйста, введите по крайней мере {0} символов.',
	maxLength: 'Пожалуйста, введите не больше чем {0} символов.',
	pattern: 'Пожалуйста, проверьте это поле.',
	step: 'Значение должно быть кратным {0}',
	email: 'Пожалуйста, укажите здесь правильный адрес электронной почты',
	date: 'Пожалуйста, введите правильную дату',
	dateISO: 'Пожалуйста, введите правильную дату в формате ISO',
	number: 'Пожалуйста, введите число',
	digit: 'Пожалуйста, введите цифры',
	phoneUS: 'Пожалуйста, укажите правильный телефонный номер',
	equal: 'Значения должны быть равны',
	notEqual: 'Пожалуйста, выберите другое значение.',
	unique: 'Пожалуйста, укажите уникальное значение.'
};
;kvl["sv-SE"] =
{
	required: 'Detta fält är obligatoriskt',
	min: 'Fyll i ett värde som är större än eller lika med {0}',
	max: 'Fyll i ett värde som är mindre än eller lika med {0}',
	minLength: 'Fyll i minst {0} tecken',
	maxLength: 'Fyll i färre än {0} tecken',
	pattern: 'Var god kontrollera värdet',
	step: 'Värdet måste ökas med {0}',
	email: 'Fyll i en korrekt e-postadress',
	date: 'Fyll i ett korrekt datum',
	dateISO: 'Fyll i ett korrekt datum',
	number: 'Fyll i ett nummer',
	digit: 'Fyll i en siffra',
	phoneUS: 'Fyll i ett korrekt telefonnummer',
	equal: 'Fyll i samma värde en gång till',
	notEqual: 'Fyll i ett annat värde',
	unique: 'Fyll i ett unikt värde'
};
;kvl["tr-TR"] =
{
	required: 'Bu alanın doldurulması zorunludur.',
	min: 'Lütfen {0} veya daha yüksek değer giriniz.',
	max: 'Lütfen {0} veya daha düşük değer giriniz.',
	minLength: 'Lütfen en az {0} karakter giriniz.',
	maxLength: 'Lütfen en fazla {0} karakter giriniz.',
	pattern: 'Lütfen bu alanı kontrol ediniz.',
	step: 'Değer {0} arttırılmalı.',
	email: 'Bu geçerli bir E-Mail adresi değil.',
	date: 'Lütfen geçerli bir tarih giriniz.',
	dateISO: 'Lütfen geçerli bir tarih giriniz.',
	number: 'Lütfen bir sayı değeri giriniz.',
	digit: 'Lütfen bir rakam değeri giriniz.',
	phoneUS: 'Lütfen geçerli bir telefon numarası giriniz.',
	equal: 'Değerler eşit olmalıdır.',
	notEqual: 'Lütfen farklı bir değer seçiniz.',
	unique: 'Lütfen değerin farklı olduğunu kontrol ediniz.'
};
;kvl["zh-CN"] =
{
	required: '必填字段',
	min: '输入值必须大于等于 {0}',
	max: '输入值必须小于等于 {0}',
	minLength: '至少输入 {0} 个字符',
	maxLength: '输入的字符数不能超过 {0} 个',
	pattern: '请检查此值',
	step: '每次步进值是 {0}',
	email: 'email地址格式不正确',
	date: '日期格式不正确',
	dateISO: '日期格式不正确',
	number: '请输入一个数字',
	digit: '请输入一个数字',
	phoneUS: '请输入一个合法的手机号(US)',
	equal: '输入值不一样',
	notEqual: '请选择另一个值',
	unique: '此值应该是唯一的'
};
}));
