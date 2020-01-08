const router =  require('express').Router()
const Shopping = require('../helpers/shoppingHelpers')
const Events = require('../helpers/eventHelpers')
const uuid = require('uuid/v4')
const packetCleanup = require('../utils/packetCleanup')

router.get('/' , (req, res) => {
    Shopping.find()
        .then( list => res.status(200).json(list))
        .catch( err => res.status(500))

})


router.post('/:eventId', (req, res) => {

    const { eventId } = req.params
    
    let values = req.body

    // if name is missing from request body return 400 message
    if( !values.name ){
        res.status(400).json({message: 'missing a name for the shopping item'})

    }else{

        Events.findById(eventId)
            .then((event) => {
                // if no event is found return 404 message
                if(!event){
                    res.status(404).json({message: "invalid event id"})

                // else proceed to try to add event
                }else{

                    const id = uuid()

                    let packet = {
                        id: id,
                        name: values.name,
                        event_id: eventId,
                        purchased: values.purchased ? 1 : 0,
                        notes: values.notes

                    }

                    // deleting any undefined or null values in packet

                    packet = packetCleanup(packet)

                    Shopping.add(packet)
                        .then( item => res.status(201).json(item))
                        .catch( err => res.status(500).json(err))
                }
            })
        }
    })

    router.get('/:eventId', ( req, res ) => {
        const { eventId } = req.params

        Shopping.findByEventId(eventId)
            .then(items =>{
                if(items){
                    for(let i = 0; i < items.length; i++){
                        items[i].purchased = items[i].purchased ? true : false
                    }
                    res.status(200).json({items: items})
                }else{
                    res.status(404)
                }
            })
            .catch(err => res.status(500))
    })



module.exports = router