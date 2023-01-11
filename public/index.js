kbs.serverUrl = '/collect';
kbs.eventClassPrefix = 'kbs';
kbs.serverSideData = { foo: 'bar' };

document.addEventListener('DOMContentLoaded', () => {
    const buttonEl03 = document.getElementById('button03');
    buttonEl03.addEventListener('click', async () => {
        const { kbs } = window;

        const data = {
            foo: 'bar'
        };
        const response = await kbs.track('custom', data);
        console.log('Programmatically Call', response);
    });

    const eventList = [{
        selector: '#button04',
        type: 'click',
        data: {
            id: 'button04',
            name: 'Selector List Btn 1',
            foo: 'bar'
        }
    }, {
        selector: '#button05',
        type: 'click',
        data: {
            id: 'button05',
            name: 'Selector List Btn 2',
            foo: 'bar'
        }
    }, {
        selector: '#button06',
        type: 'click',
        label: 'button06Click',
        data: {
            id: 'button06',
            name: 'Selector List Btn 3',
            foo: 'bar'
        }
    }];

    kbs.trackEventList(eventList);
});