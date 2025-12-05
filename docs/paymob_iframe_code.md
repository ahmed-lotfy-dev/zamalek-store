# Paymob Iframe Code

Copy and paste these sections into the corresponding fields in the Paymob "Add Iframe" popup.

## HTML Content

```html
<div class="iframeOut">
  <div class="iframBody">
    <header>
      <div class="iframeType">
        <p>Credit Card</p>
        <div class="cardsLogos">
          <img src="https://accept.paymob.com/static/img/visa.svg" />
          <img src="https://accept.paymob.com/static/img/Mastercard.svg" />
        </div>
      </div>
    </header>
    <form id="paymob_checkout">
      <div class="inputDiv">
        <input
          placeholder="Card Number"
          required
          maxlength="16"
          type="text"
          paymob_field="card_number"
        />
      </div>
      <div class="inputDiv">
        <input
          placeholder="Card Holder Name"
          required
          paymob_field="card_holdername"
        />
      </div>
      <div class="inputDiv cardExpire">
        <input
          placeholder="Exp. Month"
          required
          maxlength="2"
          type="text"
          paymob_field="card_expiry_mm"
        />
        <input
          placeholder="Exp. Year"
          required
          maxlength="2"
          type="text"
          paymob_field="card_expiry_yy"
        />
      </div>
      <div class="inputDiv">
        <input
          placeholder="CCV"
          type="text"
          required
          maxlength="4"
          paymob_field="card_cvn"
        />
      </div>
      <input type="hidden" value="CARD" paymob_field="subtype" />
      <div class="inputDiv saveCard">
        <input
          type="checkbox"
          value="tokenize"
          name="save card"
          id="save card"
        />
        <label for="save card">save card</label>
      </div>
      <input class="iframeBtn" type="submit" value="Pay" />
    </form>
    <footer>
      Powered by
      <a href="#"
        ><img src="https://accept.paymob.com/static/img/paymob_new.svg"
      /></a>
    </footer>
  </div>
</div>
```

## CSS Content

```css
@font-face {
  font-family: Avenir;
  src: url("https://accept.paymob.com/static/fonts/AvenirLTStd-Roman.ttf");
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #80959e;
  font-size: 16px;
  font-family: Avenir;
  font-weight: 400;
}
input::-moz-placeholder,
textarea::-webkit-input-placeholder {
  color: #80959e;
  font-size: 16px;
  font-family: Avenir;
  font-weight: 400;
}
input:-ms-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #80959e;
  font-size: 16px;
  font-family: Avenir;
  font-weight: 400;
}
body {
  font-family: Avenir;
  background-color: transparent;
}
p {
  padding: 0;
  margin: 0;
}
.iframeOut {
  display: flex;
  justify-content: center;
  margin: 100px 0;
}
.iframBody {
  width: 35%;
  background: #fff;
  filter: drop-shadow(0px 0px 71px rgba(10, 51, 69, 0.07));
  border-radius: 10px;
  padding: 20px;
}
@media (max-width: 768px) {
  .iframBody {
    width: 70%;
    height: auto;
    margin-top: 50px;
  }
}
header {
  border-bottom: 1px solid #e1ecf1;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 20px;
}
header .logo {
  width: 94px;
  height: 94px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.09));
  position: absolute;
  top: -47px;
  right: 50%;
  transform: translateX(50%);
}
.logo img {
  max-width: 94px;
  max-height: 94px;
}
header span {
  font-size: 18px;
  line-height: 22px;
  color: #0a384b;
  margin-top: 10px;
  display: block;
}
header h4 {
  font-weight: bold;
  font-size: 18px;
  color: #000;
  margin: 0;
  margin-top: 20px;
}
.iframeType {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
.iframeType div {
  display: flex;
}
.iframeType p {
  font-size: 18px;
  color: #0a384b;
}
.iframeType div img {
  margin-right: 10px;
}
form {
  padding: 30px 0;
}
.inputDiv {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.inputDiv.saveCard {
  justify-content: flex-start;
}
.inputDiv.saveCard input {
  height: auto;
  width: auto;
}
.inputDiv label {
  font-size: 17px;
  margin-bottom: 10px;
}
.inputDiv label span {
  font-size: 10px;
}
.inputDiv input {
  height: 55px;
  width: 100%;
  border-radius: 10px;
  background: #efefef99;
  outline: 0;
  border: 1px solid #f9fafa;
  padding-left: 10px;
  font-weight: 900;
  font-size: 19px;
  line-height: 20.4px;
  text-align: left;
  color: #0a384b;
}
.inputDiv textarea {
  width: 100%;
  border-radius: 10px;
  background: #efefef99;
  outline: 0;
  border: 1px solid #f9fafa;
  padding-left: 10px;
  font-weight: 900;
  font-size: 19px;
  text-align: left;
  color: #0a384b;
  padding-top: 10px;
  resize: none;
}
.inputDiv input:focus,
.inputDiv textarea:focus {
  border: 1px solid #28aae1;
  transition: 0.3s ease;
  background: #fff;
  box-shadow: 0px -1px 71px rgba(74, 74, 74, 0.07);
}
.inputDiv p {
  font-size: 21px;
  color: #0a384b;
  padding: 0;
  margin: 0;
  margin-left: 30px;
}
.inputDiv.cardExpire input:nth-child(2) {
  margin-left: 20px;
}
.inputDiv.address input {
  width: 24%;
}
@media (max-width: 768px) {
  .inputDiv {
    /* flex-wrap: wrap; */
  }
  .inputDiv.address input {
    width: 48%;
    margin-bottom: 10px;
  }
}
.iframeBtn {
  width: 152px;
  height: 49px;
  background-color: #31d097;
  color: #fff;
  font-family: Avenir;
  border: 0;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  font-size: 20px;
  margin: auto;
  margin-top: 20px;
  display: block;
}
footer {
  font-family: Avenir;
  font-weight: 800;
  font-size: 16px;
  color: #80959e;
  display: flex;
  align-items: center;
  justify-content: center;
}
footer img {
  margin-left: 20px;
  height: 25px;
  width: 100px;
}
```

## Javascript Content

```javascript
// No specific JS required, but field cannot be empty.
console.log("Paymob Iframe Loaded");
```
