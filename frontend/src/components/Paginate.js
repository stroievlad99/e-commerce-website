import React from 'react'
import { Pagination } from 'react-bootstrap'
import { Link, useLocation} from 'react-router-dom'


const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}


function Paginate({ page, pages , maxPageDisplay=5, isAdmin=false }) { 


  let term = useQuery().get('term') // afiseaza de ex airpods daca userul cauta airpods in bara de search

  let url = !isAdmin ? '/' : '/admin/productlist/'
  url += term ? `?term=${term}&` : '?'
  console.log('url:',url) // url: /?term=air&


  return ( pages > 1 && ( //afiam paginarea doar daca avem multe produse, altfel nu  

    <Pagination> 
        {/*daca avem 10 pagini, atunci sa afiseze 10, transpunem pages intr-un array */} 

        {/*First */} 

        {pages !=1 && page !=1 ? (

          <Pagination.First href = {`${url}page=1`}>First</Pagination.First> 
        ):(
          <Pagination.First disabled>First</Pagination.First>
        )
          
        }

        {/* Prev */}  

        {page > 1 ? (
          <Pagination.Prev href = {`${url}page=${page-1}`}>&laquo;</Pagination.Prev>
        ):(
          <Pagination.Prev disabled>&laquo;</Pagination.Prev>
        )}

        {/* Pages */}  


        {[...Array(pages).keys()].map((pageNumber) => ( page === pageNumber + 1 ? (
          <Pagination.Item key={pageNumber + 1} active href={`${url}page=${pageNumber + 1}`}>{pageNumber + 1}</Pagination.Item>
        ) : pageNumber + 1 > page && pageNumber + 1 <= page + maxPageDisplay ? ( //pagina ulterioara
          <React.Fragment key={pageNumber + 1}>
            <Pagination.Item href = {`${url}page=${pageNumber+1}`}>
              {pageNumber + 1}
            </Pagination.Item>

            {pageNumber + 1 === page + maxPageDisplay && pageNumber + 1 < pages && (
              <Pagination.Ellipsis href={`${url}page=${page+(maxPageDisplay+1)}`}/>
            )}

          </React.Fragment>
        ) : pageNumber + 1 < page && pageNumber + 1 >= page - maxPageDisplay && (

          <React.Fragment key={pageNumber + 1}>
            {pageNumber + 1 === page - maxPageDisplay && pageNumber + 1 > 1 && (
              <Pagination.Ellipsis href = {`${url}page=${page-(maxPageDisplay+1)}`}/>
            )}
            <Pagination.Item href={`${url}page=${pageNumber + 1}`}>
              {pageNumber + 1}
            </Pagination.Item>

          </React.Fragment>
        )
          
        ))} 

    {/* Next */}

    {page < pages ? (
      <Pagination.Next href={`${url}page=${page+1}`}>&raquo;</Pagination.Next>
    ):(
      <Pagination.Next disabled>&raquo;</Pagination.Next>
    )}

     {/* Last */}

     {page != pages ? (
      <Pagination.Last href={`${url}page=${pages}`}>Last</Pagination.Last>
    ):(
      <Pagination.Last disabled>Last</Pagination.Last>
    )}


    </Pagination>
      


  )
  )
  }

export default Paginate
