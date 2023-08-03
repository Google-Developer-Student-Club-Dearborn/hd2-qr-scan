export async function sendHttpRequest(method, url, expectData, body) {
    let res = await fetch(`${process.env.REACT_APP_SERVER_URL}${url}`, {
        method, 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    
    var result = {
        error: null
    }
        
    if(!res.ok){
        result.error = await res.text() || res.statusText
        result.status = res.status
    } else if (expectData){
        result.data = await res.json()
    }
    
    return result
}