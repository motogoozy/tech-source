import React, { Component } from 'react';
import axios from 'axios';
import './Search.scss';
import Navbar from '../../components/Navbar/Navbar';
import ArticleCard from '../../components/ArticleCard/ArticleCard';


export default class Search extends Component {
   state = {
      articles: [],
      page: 1,
      userInput: '',
      sortBy: 'relevancy',
   }

   componentDidMount = async () => {

   }

   getArticles = async () => {
      const key = await axios.get('/key'); //fetching api key from local server (.env file)
      const { page, userInput, sortBy } = this.state;
      try {
         let res = await axios.get(`https://newsapi.org/v2/everything`, {
            'headers': { 'Authorization': key.data },
            'params': { 'q': userInput, 'page': page, 'sortBy': sortBy }
         })
         await this.setState({ articles: res.data.articles })
      } catch (error) {
         console.log(error)
      }

      console.log('articles retrieved')
   }

   handlePageClick = async (num) => {
      await this.setState({ page: this.state.page + num })
      if (this.state.page <= 1) {
         this.setState({ page: 1 })
      }
      await this.getArticles();
   }


   render() {
      const { articles } = this.state;
      let articleCards = articles.map(article => {
         return (
            < ArticleCard
               key={article.title}
               article={article}
            />
         )
      })

      return (
         <div className='homepage-main'>
            <Navbar />
            <div className='page-subheader'>
               <input type="text" placeholder='Search' onChange={(e) => this.setState({ userInput: e.target.value })} />
               <button onClick={() => this.getArticles()}>Search</button>
               {
                  this.state.articles.length > 0 &&
                  <div className='page-button-container'>
                     <button onClick={() => this.handlePageClick(-1)}>Previous Page</button>
                     <button onClick={() => this.handlePageClick(1)}>Next Page</button>
                  </div>
               }
            </div>
            <div className="home-content">
               <div className="article-container">
                  {articleCards}
               </div>
               {
                  this.state.articles.length > 0 &&
                  <div className='page-button-container'>
                     <button onClick={() => this.handlePageClick(-1)}>Previous Page</button>
                     <button onClick={() => this.handlePageClick(1)}>Next Page</button>
                  </div>
               }
            </div>
         </div>
      )
   }
}