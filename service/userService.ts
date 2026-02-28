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
  } catch (error) {
    console.log("Error registering user:", error);
    return null;
  }
};

// login user
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const res = await instance.post("/users/login", credentials);

    if (res.data?.token) {
      // decode token to extract role
      const decoded = JSON.parse(
        atob(res.data.token.split('.')[1])
      );

      const user = {
        id: decoded.userId,
        role: decoded.role,
      };

      return {
        token: res.data.token,
        user,
      };
    }

    return null;
  } catch (error) {
    console.log("Login error:", error);
  }
};




export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const res = await instance.get(`/users/${id}`); 
    console.log("Fetched user:", res.data.data);
    return res.data.data;
  } catch (error) {
    console.error( error);
    return null;
  }
};


 export const updateUser = async (id: number, userData: Partial<User> ) =>{
  try {
     const res = await instance.put<{data: User}>(`/users/${id}`, userData);
         console.log(res.data.data)
            return res.data.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteUser = async(id: number): Promise<boolean> =>{
    try {
        const res = await instance.delete(`/users/${id}`)
        console.log(res);
        return true
    } catch (error) {
        console.log(error)
        return false 
    }
}