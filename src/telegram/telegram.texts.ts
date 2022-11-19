export const TelegramTexts = {
  START: `
Hi there! Nice to meet you 🦐🍜
I was invent to inform you, when a new unsold food appears in your region! 🤤
Unfortunatelly, I'm limited to a few food services - which you can check by using /services command 😁
    
I'm in the *mythic* alpha stage, so only limited part of users can sign up for personalize notifications 🤐
If you're one of lucky man, use the /setup command, where I'll ask you for details ✨
  `,
  SETUP: {
    WELCOME: `Ok, let's go! 🔥`,
    KEY: {
      ASK: `First by first, provide me a valid *ALPHA KEY* 🗝️`,
      VALID: `Your alpha key is valid 🎉`,
      INVALID: `Your alpha key is invalid, sorry 😔`,
    },

    LOCATION: {
      ASK: `
Next, I need your location for our services 😇
You can do this by:
 - special button below 🆗
 - in-app Map feature 🗺️
 - use command 
    /cords {latitude} {longitude}
      ex. /cords 45 54
`,
      VALID: `
It's all, thanks! 😌
If I find something in your location, I'll send you immediatelly! Promise 🥰
`,
      INVALID_LAT: `Sorry, your latitude isn't number 😕 - try again!`,
      INVALID_LNG: `Sorry, your longitude isn't number 😕 - try again!`,
    },
  },
};
