const CUSTOMER=require('./customer/cmpCustomerController');
const TRIP=require('./trip/cmpTripController');
const BUS=require('./bus/cmpBusController');

//customer
const customerAddCustomer=CUSTOMER.customerAddCustomer;

const customerGetAllCustomers=CUSTOMER.customerGetAllCustomers;

const customerGetCustomer=CUSTOMER.customerGetCustomer;

const customerGetCustomerReservations=CUSTOMER.customerGetCustomerReservations;

const customerRemoveCustomerReservation=CUSTOMER.customerRemoveCustomerReservation;

const customerDeleteCustomer=CUSTOMER.customerDeleteCustomer;

const customerUpdateCustomer=CUSTOMER.customerUpdateCustomer;

const customerAddNewBalanceToCustomer=CUSTOMER.customerAddNewBalanceToCustomer;

// trip
const tripGetAllTrips=TRIP.tripGetAllTrips;

const tripGetBusesId=TRIP.tripGetBusesId;

const tripAddTrip=TRIP.tripAddTrip;

const tripGetTripInfo=TRIP.tripGetTripInfo;

const tripRemoveCostumerFromTrip=TRIP.tripRemoveCostumerFromTrip;

const tripGetTripInfoGetBusInfo=TRIP.tripGetTripInfoGetBusInfo;

const tripDeleteTrip=TRIP.tripDeleteTrip;

//bus
const busGetAllBuses=BUS.busGetAllBuses;

const busGetBusInfo=BUS.busGetBusInfo;

const busUpdateBus=BUS.busUpdateBus;

const busRemoveBus=BUS.busRemoveBus;

const busAddBus=BUS.busAddBus;

module.exports={
    customerGetAllCustomers,
    customerGetCustomer,
    customerGetCustomerReservations,
    customerRemoveCustomerReservation,
    customerDeleteCustomer,
    customerUpdateCustomer,
    customerAddNewBalanceToCustomer,
    tripGetAllTrips,
    tripGetBusesId,
    tripAddTrip,
    tripGetTripInfo,
    tripRemoveCostumerFromTrip,
    tripGetTripInfoGetBusInfo,
    tripDeleteTrip,
    customerAddCustomer,
    busGetAllBuses,
    busGetBusInfo,
    busUpdateBus,
    busRemoveBus,
    busAddBus
}