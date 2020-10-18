const apiKey = '6BoWuIEkzsOoW57svxHbAo1C2ufHeFGuD9wZztgr'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');
};


function displayResults(data){
    $('#parks-results').empty();
    for(let i = 0; i < data.data.length; i++){
        let park = data.data[i];
        let parkAddress = park.addresses[0];
        let formattedParkAddress = ''
        if(parkAddress.line2 && parkAddress.line3){
            formattedParkAddress = `${parkAddress.line1}<br>${parkAddress.line2}<br>${parkAddress.line3}<br>${parkAddress.city}, ${parkAddress.stateCode} ${parkAddress.postalCode}`
        } else if (parkAddress.line2) {
            formattedParkAddress = `${parkAddress.line1}<br>${parkAddress.line2}<br>${parkAddress.city}, ${parkAddress.stateCode} ${parkAddress.postalCode}`            
        } else {
            formattedParkAddress = `${parkAddress.line1}<br>${parkAddress.city}, ${parkAddress.stateCode} ${parkAddress.postalCode}`  
        }
        $('#parks-results').append(`<li><h3>${park.fullName}</h3><p>${park.description}</p><p>${formattedParkAddress}</p><a href=${park.url} target=_blank>${park.fullName} Website</a></li>`)
        console.log(formattedParkAddress);
    };
    $('main').removeClass('hidden');
};


function getParksInformation(query, maxResults=10){
    const params = {
        q: query,
        limit: maxResults,
        api_key: apiKey
    };
    const queryString = formatQueryParams(params);
    const url = `${searchURL}?${queryString}`;

    fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error(`Error: ${response.status}`)
            }
                
        return response.json()
        })
        .then(data => displayResults(data))
        .catch(error => $('main').html(`<p>Something went wrong.  Error: ${error}</p>`))
};


function formSubmission(){
    $('form').submit(e => {
        e.preventDefault();
        const state = $(e.target).find('input[name="state-name"]').val();
        const maxResults = [$(e.target).find('input[name="max-results"').val()];
        getParksInformation(state, maxResults);
    });
};


$(formSubmission())

 
