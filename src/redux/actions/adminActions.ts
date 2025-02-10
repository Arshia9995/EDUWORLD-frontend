import { createAsyncThunk } from "@reduxjs/toolkit";
import { IAdminLoginData } from "../../interface/IAdminLogin";
import axios,  { AxiosError } from "axios";
import { baseUrl } from "../../config/constants";
import { ApiError, config, handleError } from "../../config/configuration";




