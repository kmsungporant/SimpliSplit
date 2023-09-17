# SimpliSplit 

### A new way to efficiently process bill splitting with your friends!

## Motivation:

The purpose of the app is to simplify the process of splitting the bill into large groups. Instead of one person having to pay with their card and calculate individual shares, the app allows users to scan a restaurant receipt and send a payment request via text message with a single button. It eliminates the need to calculate the tax/tip individually and send Venmo/Zelle requests. Although restaurants have been allowing customers to pay separately, it makes the whole process very tedious for the employee and further complicated. 

## Demo Website:
[https://www.simplisplit.com]

## Technologies Used:

Front-end:
<br>
React Native (Expo Go)
<br>
Native Wind (Tailwindcss)
<br>
TypeScript

Back-end:
<br>
Firebase API
<br>
Rapid API 

## Created By:
Dan Le
<br>
Minsung Kim
<br>
Phong Le
<br>
Peter Cao

## Functionally
All users must sign up and have an account to access the app.
The account will be logged in with Email and Password and will have the Venmo Username associated with the account as it is stored in the Firebase Database.
After scanning, the user is able to take a picture (Scan) and send it to our server which will process the data and parse each order item on the following information - 
   1. Item Name
   2. Price
   3. Quantity
<br>
The user is then asked to check if the information is correct and will be prompted to change the gratuity percentage. While the sales tax is calculated using an API, it may be sometimes inaccurate so users are still able to change the tax percentage to their needs.
The app will ask the user for access to the contacts (The app will not work if there is no permission). The app will fetch all the contacts within the phone and the user will then be able to select specific people.
Finally, the user is able to organize the order items with each contact and will send an SMS to the whole group with Venmo Request links associated with the amount due.

