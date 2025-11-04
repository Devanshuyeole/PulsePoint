import { useEffect,useState } from 'react';
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';


const News=(props)=> {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capital = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews=async()=>{
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?domains=wsj.com&category=${props.category}&apiKey=56fc2015de0744dd81b70752344e44b7&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url); //sends a GET request to the API to get the news data
    props.setProgress(30);
    let parseData = await data.json();
    props.setProgress(70);
    setArticles(parseData.articles);
    setTotalResults(parseData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  useEffect(() => {
    document.title = `${capital(props.category)} - PulsePoint`;
    updateNews();
  }, [])

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?domains=wsj.com&category=${props.category}&apiKey=56fc2015de0744dd81b70752344e44b7&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1);
    let data = await fetch(url); //sends a GET request to the API to get the news data
    let parseData = await data.json();
    console.log(parseData);
    setArticles(articles.concat(parseData.articles));
    setTotalResults(parseData.totalResults);
  }
    return (
      <div className='container my-3'>
        <h1 className="text-center" style={{ margin: '35px 0px', marginTop:'90px' }}>PulsePoint - Top {capital(props.category)} Headlines</h1>
        {loading && <Spinner />}

        <InfiniteScroll dataLength={articles.length} next={fetchMoreData} hasMore={articles.length !== totalResults} loader={<Spinner />}>

          <div className="container"><div className="row">
            {articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title} decsription={element.description} imageUrl={element.urlToImage}
                  newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
          </div>
          </div>
        </InfiniteScroll>
      </div>
    )
  }


News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general'
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News