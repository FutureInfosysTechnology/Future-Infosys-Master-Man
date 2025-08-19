// import axios from 'axios';

// class LoginApi {
//   static serverUrl = 'https://sunraise.in/ABCDADR';

//   static loginsuccufullApi = async (userName, password) => {
//     try {
//       const dataUrl = `${LoginApi.serverUrl}/getLogin?userName=${userName}&password=${password}`;
//       console.log('Request URL:', dataUrl);
//       const res = await axios.get(dataUrl); 

//       return {
//         status: res.status,
//         data: res.data,
//       };
//     } catch (error) {
//       console.error('Error in login:', error);
//       throw error; 
//     }
//   };
// }

// export default LoginApi;