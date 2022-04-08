kbs.serverSideData = { foo: 'bar' };
kbs.callback = (response) => {
    console.log('callback', response);
}
console.log('serverSideData', kbs.serverSideData);