const seoulmap = document.getElementsByClassName('map_path');
const intro = document.getElementById('intro');
const map_title = document.getElementById('map_title');
const map_choice = document.getElementById('map_choice');


const move = function(){
    for(let i=0; i<14; i++){
        // seoulmap[i].style.transform = 'translateY(-10%)';
        seoulmap[i].classList.add('change1');
    }
    for(let y=14; y<=24; y++){
        // seoulmap[y].style.transform = 'translateY(10%)';
        seoulmap[y].classList.add('change2');
    }
    intro.classList.add('change_intro');
    map_title.style.display = 'none';
    map_choice.style.display='none';
} 
const finish = function(){
    intro.style.display='none';
}



this.addEventListener('click', function(){
    move();
    setTimeout(finish,2000);
});

const SEOUL_BOUNDS = {
    north: 37.748724,
    south: 37.368829,
    west: 126.768162,
    east: 127.231761,
};
var map;
var placeList;
var contentString = [];
var clearID;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: new google.maps.LatLng(37.549338, 126.982477),
        restriction: {
            latLngBounds: SEOUL_BOUNDS,
            strictBounds: false,
    },})
    GetData()
}

function GetData() {
    $.ajax({
        method: "GET",
        url: "http://openAPI.seoul.go.kr:8088/70577046786b79623734676662666e/json/SearchParkInfoService/1/132/",         
    })
        .done(function (msg) {
            placeList = msg.SearchParkInfoService.row;
            console.log(placeList);
            CreateMarker();
        });

}
let marker;

function CreateMarker() {
    for (var i = 0; i < placeList.length; i++) {
        var lat = parseFloat(placeList[i].LATITUDE);
        var lng = parseFloat(placeList[i].LONGITUDE);

        var myLatLng = new google.maps.LatLng({ lat: lat, lng: lng });

        var icon = {
            url: '/images/tree.png',
            scaledSize: new google.maps.Size(23, 23), // size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor 
        }

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: icon
        });

        var infowindow = new google.maps.InfoWindow({});
        contentString[i] =
            '<div style="text-align: center; color:#66CC66">' + '<h2>' + placeList[i].P_PARK+'</h2>' +'</div>'
            +'<div>' + '<p>'
            + '<br><br><b>면적 : </b>' + placeList[i].AREA 
            + '<br><br><b>공원 개요 : </b>' + placeList[i].P_LIST_CONTENT                                                    
            + '<br><br><b>공원 위치 : </b>' + placeList[i].P_ADDR
            + '<br><br><b>전화번호 : </b>' + placeList[i].P_ADMINTEL                    
            + '</p>'
            + '</div>';


        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(contentString[i]);
                infowindow.open(map, marker);
                console.log(placeList[i].P_ZONE);
            }
        })(marker, i));

        marker.addListener("click", function (e) {
            map.setZoom(13);
            map.panTo(e.latlng);
        });

        var cur_image = new google.maps.MarkerImage(
            "https://myfirstmap.s3.ap-northeast-2.amazonaws.com/circle.png"
        );

        

        
    }
}


function current_position(){
    if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position){
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const latlng = new google.maps.LatLng(lat,lng);
            
            marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title:'myPosition',
                visible: true,
            });
            // map.setZoom(14,false);
            marker.setAnimation(google.maps.Animation.BOUNCE);
        });
    }else{
        alert("위치정보 사용 불가능");
    }
}
current_position();

for(let k=0; k<seoulmap.length; k++){
    seoulmap[k].addEventListener('click', function(target){
        console.log(target.path[0].id);
        move();
        setTimeout(finish,2000);
        for (var i = 0; i < placeList.length; i++){
            
            if(target.path[0].id == placeList[i].P_ZONE){
                var lat = parseFloat(placeList[i].LATITUDE);
                var lng = parseFloat(placeList[i].LONGITUDE);
                var latlng = new google.maps.LatLng(lat,lng);
                map.setZoom(14);
                map.setCenter(latlng);
            }
        }

    });
}

