const router = require('express').Router()
const uuid = require('uuid/v4')
const capitalize = require('../utils/capitalize')
const Events = require('../helpers/eventHelpers')

router.post('/:userId/add', (req, res) => {

    let data = req.body
    const { userId } = req.params

    if( data.name && 
        data.date && 
        data.startTime &&
        data.budget && 
        data.location &&
        data.private &&
        data.adultGuests ){
            
            const eventId = uuid()
            data.name = capitalize(data.name)
            data.location = capitalize(data.location)

            // setting events publicity for db
            data.private = true ? 1 : 0

            // creating and shaping packet going into the DB
            const packet = {

                id: eventId,
                name: data.name,
                date: data.date,
                start_time: data.startTime,
                end_time: data.endTime,
                budget: data.budget,
                location: data.location,
                private: data.private,
                adult_guests: data.adultGuests,
                child_guests: data.childGuests,
                background_color: data.backgroundColor,
                host_id: userId,
                theme_id: data.themeId

            }

            // deleting any undefined values in packet
            for (const key in packet){

                if(key === undefined || key === '' || key === null){
                    delete key
                }

            }

            // adding event
            Events.add(packet)
                .then( event => {
                    console.log(event)
                    if(event){
                        res.status(201).json({event: event})
                    }else{
                        res.status(500)
                    }
                })
                .catch( err => {
                    res.status(500)
                })

    }else{

        res.status(400).json({message: 'Missing required fields'})

    }
})

router.get('/:userId', ( req, res ) => {
    const { userId } = req.params
    Events
        .findByHostId( userId )
        .then( events => {
            if(events){
                res.status(200).json({events: events})
            }else{
                res.status(500)
            }
        })
        .catch( err => res.status(500))
})

router.get('/', (req, res) => {

    Events.find()
        .then((events) => res.status(200).json(events))
        .catch((err) => res.status(500).json(err))
})

module.exports = router