import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  status: "idle",
  error: null,
  chartData: {
    categories: [],
    series: [],
  },
  categorySums: {
    jewelry: 0,
    clothing: 0,
    electronics: 0,
  },
};


export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await axios.get("https://fakestoreapi.com/products/");
  return response.data ;

});




const productSlice = createSlice({

  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;

        const categories = [...new Set(action.payload.map(product => product.category))];


        const categoriesCount = categories.map(category =>
          action.payload.filter(product => product.category === category).length
        );


        state.chartData = {
          categories,
          series: [{
            name: 'Number of products',
            data: categoriesCount
          }]
        };

        state.categorySums = {
          jewelry: action.payload.filter(product => product.category === 'jewelery').reduce((sum, product) => sum + product.price, 0),
          clothing: action.payload.filter(product => product.category.includes('clothing')).reduce((sum, product) => sum + product.price, 0),
          electronics: action.payload.filter(product => product.category === 'electronics').reduce((sum, product) => sum + product.price, 0),
        };
      })


      

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
