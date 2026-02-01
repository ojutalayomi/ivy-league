import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  import React from "react"
  import { Link, useLocation } from 'react-router-dom'
  
  export function BreadcrumbNav() {
    const location = useLocation()
  
    const pathSegments = location.pathname.split('/').filter(Boolean)
    // console.log(pathSegments)
    
    // If no segments (just '/'), return empty breadcrumb
    if (pathSegments.length === 0) return <div>/</div>
  
    const breadcrumbItems = pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      
      const isLast = index === pathSegments.length - 1
      
      return {
        label,
        path: isLast ? undefined : path
      }
    })
    
    return (
      <Breadcrumb className="w-full">
        <BreadcrumbList className="text-md flex-nowrap">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className={`cursor-pointer ${index !== breadcrumbItems.length - 1 && 'truncate'}`}>
                {item.path ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.path} className="truncate" replace>{decodeURIComponent(item.label)}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{decodeURIComponent(item.label)}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }