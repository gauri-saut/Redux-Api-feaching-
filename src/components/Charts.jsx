import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../utils/productSlice';
import Chart from 'react-apexcharts';


const Charts = () => {

  const dispatch = useDispatch();



  const { products, status, error, chartData, categorySums } = useSelector((state) => state.products);

  const [priceChartData, setPriceChartData] = useState({

    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [],   //--------x axix
      },
    },
    series: [{        // y axis price  
      name: 'Number of Products',
      data: [],
    }],
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    } else if (status === 'succeeded') {
      const categories = [...new Set(products.map(product => product.category))];
      const categoriesCount = categories.map(category =>
        products.filter(product => product.category === category).length
      );




      setPriceChartData({
        options: {
          chart: {
            id: 'basic-bar',
          },
          xaxis: {
            categories: categories,
          },
        },
        series: [{
          name: 'Number of Products',
          data: categoriesCount,
        }],
      });
    }
  }, [status, dispatch, products]);



  

  const getTitlePriceData = () => {
    const titles = products.map(product => product.title);
    const prices = products.map(product => product.price);

    return {
      options: {
        chart: {
          id: 'title-price-bar',
        },
        xaxis: {
          categories: titles,
        },
      },
      series: [{
        name: 'Price',
        data: prices,
      }],
    };
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <div className="row">
       
      </div>
  
      <div className="title-price-chart">
        <h2>Title AND Price</h2>
        <Chart
          options={getTitlePriceData().options}
          series={getTitlePriceData().series}
          type='bar'
          width="500"
        />
      </div>
    </div>
  );
};

export default Charts;
