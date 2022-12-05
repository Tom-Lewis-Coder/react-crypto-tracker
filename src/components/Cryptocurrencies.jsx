import React, { useState, useEffect } from 'react'
import millify from 'millify'
import { Link } from 'react-router-dom'
import { Card, Row, Col, Input, Typography } from 'antd'

import { useGetCryptosQuery } from '../services/CryptoApi'
import Loader from './Loader'

const { Title } = Typography

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 100
  const { data: cryptosList, isFetching } = useGetCryptosQuery(count)
  const [ cryptos, setCryptos ] = useState(cryptosList?.data?.coins)
  const [ searchTerm, setSearchTerm ] = useState('')
  const [ ordered, setOrdered ] = useState(false)

  useEffect(() => { 
    const filteredData = cryptosList?.data?.coins.filter((coin) => coin.name.toLowerCase().includes(searchTerm))
    setCryptos(filteredData)
  }, [cryptosList, searchTerm])

  if (isFetching) return <Loader />

  let coinCards = cryptos && ordered ? [...cryptos].sort((a,b) => b.change - a.change) : cryptos

  return (
    <>
      <div>
        {!simplified && <Title level={2} className='show-less'><Link to={'/'}>Back</Link></Title>}
      </div>
      <div className='search-crypto'>
        {!simplified && <Input placeholder='Search Cryptocurrency' onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}/>}
      </div>
      <button className='sort-button' onClick={() => setOrdered(current => !current)} >{ordered === false ? '24hr Change' : 'Coin Ranking' }</button>
      <Row gutter={[32, 32]} className='crypto-card-container'>  
        {coinCards?.map((currency) => (
          <Col xs={24} sm={12} lg={6} className='crypto-card' key={currency.uuid}>
            <Link key={currency.uuid} to={`/crypto/${currency.uuid}`}>
              <Card
                title={`${currency.rank}. ${currency.name}`}
                extra={<img className='crypto-image' src={currency.iconUrl} alt=''/>}
                hoverable
                >
                  <p>Price: {`$${millify(currency.price)}`} </p>
                  <p>Market Cap: {`$${millify(currency.marketCap)}`} </p>
                  <p>Daily Change: {`${millify(currency.change)}%`} </p>
                </Card>
            </Link>
          </Col>
        ))
        }
      </Row>
    </>
  )
}

export default Cryptocurrencies