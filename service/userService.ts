import instance from "../axios";
import { User } from "../types";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const res = await instance.get("/users/");
    console.log(res.data);
    return res.data.data; 
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

//create user 
export const register = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const res = await instance.post<{ data: User }>("/users/register", userData);

    if (res.data?.data) {
      console.log("User registered successfully:", res.data.data);
      return res.data.data;
    }

    console.error("Unexpected response structure:", res.data);
    return null;
  } catch (error: any) {
    console.error("Registration error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return null;
  }
};

// login user
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const res = await instance.post("/users/login", credentials);

    if (res.data?.token && res.data?.user) {
      return {
        token: res.data.token,
        user: res.data.user,
      };
    }
    return null;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    return null;
  }
};



// export const getUserById = async (userId: number): Promise<User | null> => {
//   try {
//     const res = await instance.get(`/users/${userId}`); 
//     console.log("Fetched user:", res.data.data);
//     return res.data.data;
//   } catch (error) {
//     console.error( error);
//     return null;
//   }
// };

// export const updateUser = async (id: number, user: Partial<User> ) =>{
//   try {
//      const res = await instance.put<{data: User}>(`/users/update/${id}`, user);
//        console.log(res.data.data)
//        return res.data.data
//   } catch (error) {
//     console.log(error)
//   }
// }


//   export const deleteUser = async(userId: number): Promise<boolean> =>{
//     try {
//       const res = await instance.delete(`/users/delete/${userId}`)
//       console.log(res);
//       return true
//     } catch (error) {
//       console.log(error)
//       return false 
//     }
//   }