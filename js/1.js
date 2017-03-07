/**
 * Created by Administrator on 2017/3/6.
 */
yourConnection.createOffer().then(offer => {
    yourConnection.setLocalDescription(offer);
theirConnection.setRemoteDescription(offer);
theirConnection.createAnswer().then(answer => {
    theirConnection.setLocalDescription(answer);
yourConnection.setRemoteDescription(answer);
})
});

yourConnection.createOffer().then( function( offer ){

    yourConnection.setLocalDescription(offer);
    theirConnection.setRemoteDescription(offer);

    theirConnection.createAnswer().then(function ( answer ){
        theirConnection.setLocalDescription(answer);
        yourConnection.setRemoteDescription(answer);
    })

});