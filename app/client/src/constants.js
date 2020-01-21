const angular = require('angular');

angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'FireEye Hackathon 2020',
    })
    .constant('DASHBOARD', {
        INCOMPLETE_TITLE: 'You still need to complete your profile!',
        INCOMPLETE: 'If you do not complete your profile before the [PROFILE_DEADLINE], you will not be able to check-in for the hackathon!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Unfortunately, registration has closed and you have not filled out your profile.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, it is likely that you will not receive any extra hardware, software, or goodies the day of the hackathon..',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the lottery with a team.\nHowever, you can still form teams on your own before or during the event!',
        MAX_SIZE: 8
    })
    .constant('CONFIG', {
        // STAGE_ENDPOINT: '/dev'
        STAGE_ENDPOINT: ''
    })
