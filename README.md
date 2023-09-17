# ➗ SimpliSplit ➗

### A new way to efficiently process bill splitting with your friends!

<img src="src/frontend/assets/apple.png" width="149" height="44">

## Motivation:

The purpose of the app is to simplify the process of splitting the bill in large groups. Instead of one person having to pay with their card and calculate individual shares, the app allows users to scan a restaurant receipt and send a payment request via text message with a single button. It eliminates the need to individually calculate the tax/tip and send Venmo/Zelle requests individually. Although restaurants have been allowing customers to pay separately, it makes the whole process very tedious for the employee and further complicated. 

## Usage:

1. Scan Receipt
2. Select contacts to add to transaction
   1. Drag each contact to each item they purchased
3. Send message request to everyone including item purchased and amount owed :)

## Technologies Used:

1. React-Native
    1. CSS: Native Wind
2. Python
    1. Twilio
    2. Venmo API
3. Firebase

## Created By:
Dan Le
<br>
Minsung Kim
<br>
Phong Le

## Features and Functionality

The app should be able to get login info from the user.

Data fetched from Firebase includes (All data is given from the associated google account):
1. User ID - Firebase assigns a unique ID to each user upon registration. This ID can be used to identify and track the user's activities within the app.
2. Email - If the user logged in using an email and password combination, Firebase can provide the user's email address.
3. Display Name - Firebase allows users to set a display name associated with their account. This name can be provided upon login if it has been set by the user.
4. Profile Picture - Users can often upload a profile picture to their Firebase account. After logging in, the profile picture URL or a reference to the image can be retrieved.
5. Custom User Data - Firebase provides the ability to store additional user data in the database. This can include custom fields such as age, location, preferences, or any other relevant information.
6. Access Tokens - Upon successful login, Firebase can provide an access token or a JSON Web Token (JWT) that can be used to authenticate subsequent requests to Firebase services or your own backend server.


After successful login, the user can either scan using their camera or browse their photos to upload in their gallery.
When the user selects either camera or photo, it will prompt the user to allow permission for access.


After successful scan, the user will either have the option to scan again or continue based on if the scan read the receipt properly.
The scan of the receipt should store the following in an object:
1. Quantity
2. Name of order
3. Price

Using the objects created by the scan, the user will be prompted to select individuals in their contacts list.
The user will have to have them in their contact list in order to use the app.

After selection, users will be asked to organize the order objects with each individuals. (Not too sure on how to design the UX). 

The app will then send a message to the contacts using “Twilio”. 
Information sent will be the following:
1. Name of the sender (the User) 
3. List of orders
4. Total price
5. Later on will implement a venmo request link.
