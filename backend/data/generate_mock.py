"""
Generate 35 mock rental property listings for London and append them
to the existing london-rent-properties.json JSONL file.
"""

import json
import os

OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "london-rent-properties.json")

AGENCIES = [
    "Foxtons, London",
    "Knight Frank, London",
    "Savills, London",
    "Hamptons, London",
    "Marsh & Parsons, London",
    "Winkworth, London",
    "Kinleigh Folkard & Hayward, London",
    "Chestertons, London",
    "Benham & Reeves, London",
    "Knight Bishop, London",
]

PHONE_NUMBERS = [
    "020 7893 1616",
    "020 7861 1054",
    "020 7016 6750",
    "020 7590 4200",
    "020 7736 2222",
    "020 7229 6677",
    "020 8659 3322",
    "020 7324 4440",
    "020 7734 4444",
    "020 7935 0035",
]

BASE_URL = "https://www.rightmove.co.uk/property-to-rent/find.html?searchLocation=London&useLocationIdentifier=true&locationIdentifier=REGION%5E87490&radius=0.0&_includeLetAgreed=on"

properties = [
    # ===== FOR THE COUPLE (Canary Wharf + night bus) =====
    {
        "listing_title": "22 Belgrave Road, London, E1",
        "location": "22 Belgrave Road, Stepney Green, London, E1 0NR",
        "postcode": "E1",
        "latitude": 51.5270,
        "longitude": -0.0475,
        "price": 1750,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Double glazing",
            "Gas central heating",
            "Private balcony",
            "EPC Rating C",
            "Furnished",
            "Near Mile End Park"
        ],
        "description": "A bright and spacious two-bedroom flat on Belgrave Road in the heart of Stepney Green. The property features a generous open-plan reception room, modern kitchen with integrated appliances, and excellent transport links via Stepney Green tube (District/Hammersmith & City) and Mile End (Central line). The N15 night bus runs directly to UCLH, and PureGym Mile End is just a 5-minute walk. Mile End Medical Centre is nearby for GP services."
    },
    {
        "listing_title": "14 Narrow Street, London, E14",
        "location": "14 Narrow Street, Limehouse, London, E14 8DP",
        "postcode": "E14",
        "latitude": 51.5120,
        "longitude": -0.0395,
        "price": 1600,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "River views",
            "Modern bathroom",
            "Wooden flooring",
            "EPC Rating B",
            "Furnished",
            "Secure entry"
        ],
        "description": "A stylish one-bedroom flat on the iconic Narrow Street in Limehouse, overlooking the Thames. Limehouse DLR station is just 4 minutes away, offering direct services to Canary Wharf in under 10 minutes. The area boasts a vibrant dining scene including the historic Grapes pub. Night bus routes provide excellent late-night connectivity across London."
    },
    {
        "listing_title": "37 Burdett Road, London, E3",
        "location": "37 Burdett Road, Mile End, London, E3 7TN",
        "postcode": "E3",
        "latitude": 51.5260,
        "longitude": -0.0350,
        "price": 1700,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Open-plan kitchen",
            "Double bedroom",
            "Near Mile End Park",
            "EPC Rating C",
            "Furnished",
            "Bike storage"
        ],
        "description": "A well-presented two-bedroom flat on Burdett Road, perfectly positioned between Mile End and Bow. Mile End station (Central, District, Hammersmith & City lines) is a short walk, providing swift access to Canary Wharf via the Jubilee line at Stratford. Mile End Park and the Regent's Canal offer excellent green space, and a local GP surgery is within easy reach."
    },
    {
        "listing_title": "85 Whitechapel Road, London, E1",
        "location": "85 Whitechapel Road, Whitechapel, London, E1 1JQ",
        "postcode": "E1",
        "latitude": 51.5195,
        "longitude": -0.0593,
        "price": 1450,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "High ceilings",
            "Period features",
            "Gas central heating",
            "EPC Rating D",
            "Unfurnished",
            "Near Royal London Hospital"
        ],
        "description": "A characterful two-bedroom flat on the bustling Whitechapel Road with excellent Elizabeth line connectivity to Canary Wharf in under 5 minutes. Whitechapel station also serves the District and Hammersmith & City lines. The area is rich in cultural diversity with the famous Whitechapel Market and Gallery right on the doorstep."
    },
    {
        "listing_title": "8 Aberfeldy Street, London, E14",
        "location": "8 Aberfeldy Street, Poplar, London, E14 0NU",
        "postcode": "E14",
        "latitude": 51.5075,
        "longitude": -0.0175,
        "price": 1550,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Modern development",
            "Open-plan living",
            "Integrated appliances",
            "EPC Rating B",
            "Furnished",
            "Concierge service"
        ],
        "description": "A contemporary one-bedroom flat in a modern development on Aberfeldy Street, Poplar. Poplar DLR station is a 3-minute walk with direct trains to Canary Wharf in just 2 stops. The area has seen significant regeneration with new cafes, shops, and the Chrisp Street Market all within walking distance."
    },
    {
        "listing_title": "15 Fairfield Road, London, E3",
        "location": "15 Fairfield Road, Bow, London, E3 2AY",
        "postcode": "E3",
        "latitude": 51.5280,
        "longitude": -0.0220,
        "price": 1650,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Victorian conversion",
            "Private garden access",
            "Original features",
            "EPC Rating C",
            "Part furnished",
            "Storage"
        ],
        "description": "A charming two-bedroom flat in a Victorian conversion on Fairfield Road, Bow. Bow Road station (District/Hammersmith & City) and Bow Church DLR provide easy access to Canary Wharf and the City. The property benefits from a private garden and is close to the beautiful Victoria Park for weekend strolls."
    },

    # ===== FOR THE NURSE (St Thomas' + school + parking) =====
    {
        "listing_title": "9 Cleaver Square, London, SE11",
        "location": "9 Cleaver Square, Kennington, London, SE11 4DR",
        "postcode": "SE11",
        "latitude": 51.4885,
        "longitude": -0.1145,
        "price": 1350,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Ground floor",
            "Allocated parking space",
            "Private garden",
            "EPC Rating C",
            "Furnished",
            "Near outstanding primary school"
        ],
        "description": "A rare ground-floor two-bedroom flat on the prestigious Cleaver Square in Kennington, featuring allocated parking and a private garden. Kennington station (Northern line) is a 5-minute walk, connecting directly to Waterloo and Westminster for St Thomas' Hospital. The N155 night bus runs 24 hours along Kennington Road. An outstanding-rated primary school is within the catchment area, making this ideal for families."
    },
    {
        "listing_title": "44 Westmoreland Road, London, SE17",
        "location": "44 Westmoreland Road, Elephant & Castle, London, SE17 2BY",
        "postcode": "SE17",
        "latitude": 51.4945,
        "longitude": -0.0995,
        "price": 1400,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Allocated parking",
            "Double bedroom",
            "Storage cupboards",
            "EPC Rating C",
            "Furnished",
            "Near primary school"
        ],
        "description": "A well-maintained two-bedroom flat on Westmoreland Road in Elephant & Castle, featuring an allocated parking space. Elephant & Castle station (Northern and Bakerloo lines) provides direct access to Westminster for St Thomas' Hospital in under 10 minutes. Several well-regarded primary schools are within walking distance, and the newly regenerated Elephant Park offers excellent green space."
    },
    {
        "listing_title": "27 South Lambeth Road, London, SW8",
        "location": "27 South Lambeth Road, Vauxhall, London, SW8 1SP",
        "postcode": "SW8",
        "latitude": 51.4860,
        "longitude": -0.1235,
        "price": 1300,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Modern development",
            "Secure parking available",
            "Concierge",
            "EPC Rating B",
            "Furnished",
            "Gym in building"
        ],
        "description": "A sleek one-bedroom flat on South Lambeth Road in Vauxhall, within a modern development offering secure parking. Vauxhall station (Victoria line and South Western Railway) is a 6-minute walk, connecting to Westminster in 4 minutes. The area is popular with healthcare professionals due to its proximity to St Thomas' and excellent transport links."
    },
    {
        "listing_title": "31 Wansey Street, London, SE17",
        "location": "31 Wansey Street, Walworth, London, SE17 1JT",
        "postcode": "SE17",
        "latitude": 51.4915,
        "longitude": -0.0915,
        "price": 1250,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Council parking permit",
            "Ground floor",
            "Near primary school",
            "EPC Rating C",
            "Part furnished",
            "Double glazing"
        ],
        "description": "A practical two-bedroom ground-floor flat on Wansey Street in Walworth, ideal for those needing easy access and parking. Regular bus routes along Walworth Road connect to Westminster and St Thomas' Hospital in approximately 15 minutes. A highly regarded local primary school is within a short walk, and the East Street Market offers affordable fresh produce."
    },
    {
        "listing_title": "18 Long Lane, London, SE1",
        "location": "18 Long Lane, Bermondsey, London, SE1 4PG",
        "postcode": "SE1",
        "latitude": 51.4975,
        "longitude": -0.0715,
        "price": 1380,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Street parking",
            "Modern kitchen",
            "Near primary school",
            "EPC Rating C",
            "Furnished",
            "Near Bermondsey Street"
        ],
        "description": "A modern two-bedroom flat on Long Lane in Bermondsey, offering street parking and excellent connectivity. Bermondsey station (Jubilee line) is a 7-minute walk, providing quick access to Westminster for St Thomas' Hospital. The vibrant Bermondsey Street with its restaurants and galleries is nearby, along with well-regarded local primary schools."
    },
    {
        "listing_title": "5 Binfield Road, London, SW9",
        "location": "5 Binfield Road, Stockwell, London, SW9 9AH",
        "postcode": "SW9",
        "latitude": 51.4720,
        "longitude": -0.1235,
        "price": 1200,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Resident parking",
            "Large living room",
            "Near primary school",
            "EPC Rating D",
            "Unfurnished",
            "Near Larkhall Park"
        ],
        "description": "A spacious two-bedroom flat on Binfield Road in Stockwell, offering excellent value with resident parking. Stockwell station (Northern and Victoria lines) connects to Westminster in under 10 minutes. The property is close to Larkhall Park and several primary schools, making it a practical choice for budget-conscious families working at St Thomas' Hospital."
    },

    # ===== FOR THE STUDENT (King's 3 campuses + pharmacy + quiet) =====
    {
        "listing_title": "12 Trinity Street, London, SE1",
        "location": "12 Trinity Street, Borough, London, SE1 1DB",
        "postcode": "SE1",
        "latitude": 51.5015,
        "longitude": -0.0935,
        "price": 925,
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": "Studio",
        "amenities": [
            "Quiet residential street",
            "Nearby pharmacy",
            "Bike storage",
            "EPC Rating C",
            "Furnished",
            "All bills included"
        ],
        "description": "A well-proportioned studio flat on the peaceful Trinity Street in Borough, located on a quiet residential street away from main roads. A Boots pharmacy is just around the corner on Borough High Street. London Bridge station provides Northern line access to Waterloo (King's Strand campus) in 3 minutes, and Denmark Hill campus is reachable via London Bridge to Denmark Hill trains. Borough station (Northern line) is also a short walk."
    },
    {
        "listing_title": "28 Brandon Street, London, SE1",
        "location": "28 Brandon Street, Elephant & Castle, London, SE1 7LU",
        "postcode": "SE1",
        "latitude": 51.4935,
        "longitude": -0.1015,
        "price": 900,
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": "Studio",
        "amenities": [
            "Modern fit-out",
            "Near pharmacy",
            "Laundry room",
            "EPC Rating B",
            "Furnished",
            "Near library"
        ],
        "description": "A compact and modern studio on Brandon Street near Elephant & Castle, ideal for student living. Elephant & Castle station (Northern and Bakerloo lines) connects directly to Waterloo for King's Strand campus in under 5 minutes. A local pharmacy is on the ground floor of the nearby shopping centre, and the area benefits from a large Tesco and multiple bus routes to all King's campuses."
    },
    {
        "listing_title": "19 Hatfields, London, SE1",
        "location": "19 Hatfields, Southwark, London, SE1 8DJ",
        "postcode": "SE1",
        "latitude": 51.5035,
        "longitude": -0.1035,
        "price": 875,
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": "Studio",
        "amenities": [
            "Quiet courtyard setting",
            "Pharmacy nearby",
            "Modern kitchen",
            "EPC Rating C",
            "Furnished",
            "Near Southwark station"
        ],
        "description": "A well-presented studio in the Hatfields development, set back from the main road in a quiet courtyard. Southwark station (Jubilee line) is a 4-minute walk, connecting to Waterloo for King's Strand campus in one stop. A Lloyds pharmacy is on nearby Blackfriars Road. The Tate Modern and South Bank cultural quarter are within pleasant walking distance."
    },
    {
        "listing_title": "7 Melior Place, London, SE1",
        "location": "7 Melior Place, London Bridge, London, SE1 3NF",
        "postcode": "SE1",
        "latitude": 51.5045,
        "longitude": -0.0865,
        "price": 950,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "One bedroom",
            "Near pharmacy",
            "Quiet cul-de-sac",
            "EPC Rating C",
            "Furnished",
            "Near Borough Market"
        ],
        "description": "A smart one-bedroom flat on the peaceful Melior Place, a quiet cul-de-sac moments from London Bridge station. The Northern line connects directly to Waterloo for King's Strand campus in 3 minutes, while London Bridge mainline serves Denmark Hill directly. A Day Lewis pharmacy is on Tower Bridge Road. The world-famous Borough Market is on the doorstep for fresh food shopping."
    },
    {
        "listing_title": "3 Rennie Street, London, SE1",
        "location": "3 Rennie Street, Waterloo, London, SE1 8TJ",
        "postcode": "SE1",
        "latitude": 51.5035,
        "longitude": -0.1140,
        "price": 975,
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": "Studio",
        "amenities": [
            "Walk to King's Strand",
            "Near pharmacy",
            "Quiet street",
            "EPC Rating B",
            "Furnished",
            "Near South Bank"
        ],
        "description": "A bright studio flat on Rennie Street in Waterloo, perfectly positioned for King's College students. King's Strand campus is a pleasant 10-minute walk along the South Bank. Waterloo station provides Northern line access to London Bridge for onward travel to Denmark Hill campus. A Boots pharmacy is on Waterloo Road, and the area offers unmatched cultural amenities including the National Theatre and BFI."
    },
    {
        "listing_title": "41 Newington Causeway, London, SE1",
        "location": "41 Newington Causeway, Newington, London, SE1 6DR",
        "postcode": "SE1",
        "latitude": 51.4980,
        "longitude": -0.0980,
        "price": 850,
        "bedrooms": 0,
        "bathrooms": 1,
        "property_type": "Studio",
        "amenities": [
            "Budget-friendly",
            "Near pharmacy",
            "Good transport links",
            "EPC Rating C",
            "Furnished",
            "Near Imperial War Museum"
        ],
        "description": "An affordable studio flat on Newington Causeway in Newington, offering excellent value for King's College students. Elephant & Castle station (Northern and Bakerloo lines) is a 3-minute walk, providing direct access to Waterloo for King's Strand campus. A pharmacy is located on the nearby Elephant & Castle shopping parade. The Imperial War Museum and pleasant green spaces are close by."
    },

    # ===== GENERAL FILLER (variety of London areas and prices) =====
    {
        "listing_title": "22 Amhurst Road, London, E8",
        "location": "22 Amhurst Road, Hackney, London, E8 1AJ",
        "postcode": "E8",
        "latitude": 51.5450,
        "longitude": -0.0555,
        "price": 1400,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Hackney Downs views",
            "Modern kitchen",
            "Striped floors",
            "EPC Rating C",
            "Furnished",
            "Near Broadway Market"
        ],
        "description": "A stylish one-bedroom flat on Amhurst Road in the heart of Hackney, overlooking Hackney Downs. Hackney Central and Hackney Downs stations provide excellent Overground connections to Stratford, Liverpool Street, and beyond. Broadway Market and London Fields are a short walk away, offering trendy cafes, restaurants, and the famous Saturday market."
    },
    {
        "listing_title": "14 Lower Clapton Road, London, E5",
        "location": "14 Lower Clapton Road, Clapton, London, E5 0NT",
        "postcode": "E5",
        "latitude": 51.5630,
        "longitude": -0.0560,
        "price": 1600,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Period conversion",
            "Private garden",
            "High ceilings",
            "EPC Rating D",
            "Part furnished",
            "Near Clapton Pond"
        ],
        "description": "A spacious two-bedroom flat in a handsome period conversion on Lower Clapton Road. Clapton station (Overground) connects to Liverpool Street in 15 minutes. The property features a private garden and is close to the leafy surroundings of Clapton Pond and Hackney Marshes. The area has become a sought-after destination with artisan bakeries and independent shops."
    },
    {
        "listing_title": "31 Cross Street, London, N1",
        "location": "31 Cross Street, Islington, London, N1 2BA",
        "postcode": "N1",
        "latitude": 51.5350,
        "longitude": -0.1050,
        "price": 1750,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Georgian terrace",
            "Private balcony",
            "Premium location",
            "EPC Rating C",
            "Furnished",
            "Near Upper Street"
        ],
        "description": "An elegant one-bedroom flat on the desirable Cross Street in Islington, set within a beautiful Georgian terrace. Angel station (Northern line) is a 6-minute walk, providing swift access to the City and beyond. Upper Street and Chapel Market offer an array of shops, restaurants, and the famous Islington Green. A premium address in one of London's most sought-after neighbourhoods."
    },
    {
        "listing_title": "9 Parkway, London, NW1",
        "location": "9 Parkway, Camden, London, NW1 7PG",
        "postcode": "NW1",
        "latitude": 51.5400,
        "longitude": -0.1420,
        "price": 2100,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Prime Camden location",
            "Modern bathroom",
            "Open-plan living",
            "EPC Rating C",
            "Furnished",
            "Near Regent's Park"
        ],
        "description": "A contemporary two-bedroom flat on Parkway in the heart of Camden Town. Camden Town station (Northern line) is moments away, connecting to Euston and King's Cross in minutes. The property sits between the vibrant Camden Market and the tranquil Regent's Park, offering the best of both worlds. Camden Lock and the canal towpath are perfect for weekend walks."
    },
    {
        "listing_title": "18 Uxbridge Road, London, W12",
        "location": "18 Uxbridge Road, Shepherd's Bush, London, W12 8LJ",
        "postcode": "W12",
        "latitude": 51.5050,
        "longitude": -0.2180,
        "price": 1500,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Near Westfield",
            "Modern kitchen",
            "Double glazing",
            "EPC Rating B",
            "Furnished",
            "Near Central line"
        ],
        "description": "A well-appointed one-bedroom flat on Uxbridge Road in Shepherd's Bush, perfectly positioned for shopping and transport. Shepherd's Bush station (Central line) and Goldhawk Road (Hammersmith & City) provide excellent connections across London. Westfield shopping centre is a 5-minute walk, offering extensive retail and dining options, along with a Vue cinema."
    },
    {
        "listing_title": "45 The Broadway, London, W5",
        "location": "45 The Broadway, Ealing, London, W5 5JN",
        "postcode": "W5",
        "latitude": 51.5130,
        "longitude": -0.3020,
        "price": 1400,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Spacious reception",
            "Near Ealing Common",
            "Gas central heating",
            "EPC Rating C",
            "Unfurnished",
            "Near Ealing Broadway"
        ],
        "description": "A generous two-bedroom flat on The Broadway in Ealing, offering excellent space for the price. Ealing Broadway station (Central, District lines, and Elizabeth line) connects to Bond Street in 14 minutes. The property is close to the green expanses of Ealing Common and Walpole Park, and Ealing's restaurant quarter on Haven Green is just around the corner."
    },
    {
        "listing_title": "12 George Street, London, CR0",
        "location": "12 George Street, Croydon, London, CR0 1LA",
        "postcode": "CR0",
        "latitude": 51.3760,
        "longitude": -0.0980,
        "price": 1200,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Excellent value",
            "Large rooms",
            "Near tram link",
            "EPC Rating C",
            "Furnished",
            "Near Centrale shopping"
        ],
        "description": "A spacious two-bedroom flat on George Street in central Croydon, offering outstanding value for space. East Croydon station provides fast trains to London Bridge in 16 minutes and to Victoria in 19 minutes. The Croydon tram network connects to Wimbledon and Beckenham. Centrale and Whitgift shopping centres offer extensive retail options right on the doorstep."
    },
    {
        "listing_title": "27 Brixton Hill, London, SW9",
        "location": "27 Brixton Hill, Brixton, London, SW9 6DE",
        "postcode": "SW9",
        "latitude": 51.4610,
        "longitude": -0.1150,
        "price": 1250,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Near Brixton Village",
            "Modern fit-out",
            "Double bedroom",
            "EPC Rating C",
            "Furnished",
            "Near Brockwell Park"
        ],
        "description": "A modern one-bedroom flat on Brixton Hill, moments from the vibrant heart of Brixton. Brixton station (Victoria line) connects to Oxford Circus in 9 minutes. The renowned Brixton Village and Pop Brixton offer an incredible range of international cuisine, while Brockwell Park provides a beautiful green retreat with its famous lido."
    },
    {
        "listing_title": "33 Rye Lane, London, SE15",
        "location": "33 Rye Lane, Peckham, London, SE15 5EX",
        "postcode": "SE15",
        "latitude": 51.4690,
        "longitude": -0.0690,
        "price": 1350,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Near Peckham Levels",
            "Open-plan kitchen",
            "Good natural light",
            "EPC Rating C",
            "Furnished",
            "Near Peckham Rye Park"
        ],
        "description": "A bright two-bedroom flat on Rye Lane in Peckham, at the centre of one of London's most dynamic neighbourhoods. Peckham Rye station provides Overground and Southern services to London Bridge in 11 minutes. The iconic Peckham Levels and Frank's Cafe rooftop bar are local landmarks, and Peckham Rye Park offers a beautiful green escape."
    },
    {
        "listing_title": "8 Lee High Road, London, SE13",
        "location": "8 Lee High Road, Lewisham, London, SE13 5PL",
        "postcode": "SE13",
        "latitude": 51.4640,
        "longitude": -0.0130,
        "price": 1100,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Affordable rent",
            "Near Lewisham Market",
            "DLR access",
            "EPC Rating D",
            "Part furnished",
            "Near Blackheath"
        ],
        "description": "An affordable one-bedroom flat on Lee High Road in Lewisham, offering great value in a well-connected location. Lewisham station (DLR and Southeastern trains) connects to London Bridge in 9 minutes and Canary Wharf via DLR in 20 minutes. The property is close to the historic Blackheath village and its beautiful heath, plus the daily Lewisham Market for fresh produce."
    },
    {
        "listing_title": "5 Celebration Avenue, London, E15",
        "location": "5 Celebration Avenue, Stratford, London, E15 1NG",
        "postcode": "E15",
        "latitude": 51.5415,
        "longitude": -0.0035,
        "price": 1500,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Near Westfield Stratford",
            "Modern development",
            "Balcony",
            "EPC Rating B",
            "Furnished",
            "Near Queen Elizabeth Park"
        ],
        "description": "A contemporary two-bedroom flat on Celebration Avenue in Stratford, situated in the thriving East Village development. Stratford station (Central, Jubilee, DLR, Elizabeth line, and Overground) offers some of London's best transport connections. Westfield Stratford City, the Queen Elizabeth Olympic Park, and the new East Bank cultural quarter are all within walking distance."
    },
    {
        "listing_title": "16 Westferry Road, London, E14",
        "location": "16 Westferry Road, Canary Wharf, London, E14 8ND",
        "postcode": "E14",
        "latitude": 51.5050,
        "longitude": -0.0195,
        "price": 1800,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Canary Wharf location",
            "Concierge service",
            "Gym in building",
            "EPC Rating B",
            "Furnished",
            "Near Crossrail"
        ],
        "description": "A premium one-bedroom flat on Westferry Road in Canary Wharf, at the heart of London's financial district. Canary Wharf station (Jubilee line and Elizabeth line) connects to Bond Street in 14 minutes via Crossrail. The area offers world-class dining, shopping at Jubilee Place, and the beautiful waterside walkways of the Docklands."
    },
    {
        "listing_title": "22 London Street, London, W2",
        "location": "22 London Street, Paddington, London, W2 1HL",
        "postcode": "W2",
        "latitude": 51.5155,
        "longitude": -0.1755,
        "price": 1700,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Near Paddington Station",
            "Modern bathroom",
            "Wooden floors",
            "EPC Rating C",
            "Furnished",
            "Near Hyde Park"
        ],
        "description": "A smart one-bedroom flat on London Street in Paddington, perfectly located for transport and leisure. Paddington station (Bakerloo, Circle, District, Hammersmith & City lines, plus Elizabeth line and Heathrow Express) is a 2-minute walk. Hyde Park and Kensington Gardens are on the doorstep, offering 400 acres of green space in the heart of London."
    },
    {
        "listing_title": "11 Kilburn High Road, London, NW6",
        "location": "11 Kilburn High Road, Kilburn, London, NW6 5UH",
        "postcode": "NW6",
        "latitude": 51.5370,
        "longitude": -0.1980,
        "price": 1450,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Spacious rooms",
            "Near Queen's Park",
            "Gas central heating",
            "EPC Rating C",
            "Part furnished",
            "Near Jubilee line"
        ],
        "description": "A well-proportioned two-bedroom flat on Kilburn High Road, offering excellent space in a convenient location. Kilburn station (Jubilee line) and Kilburn Park (Bakerloo line) provide direct access to the West End and City. The leafy Queen's Park is nearby with its popular farmers' market, and the area has a growing selection of independent cafes and restaurants."
    },
    {
        "listing_title": "38 Mitcham Lane, London, SW17",
        "location": "38 Mitcham Lane, Tooting, London, SW17 9NG",
        "postcode": "SW17",
        "latitude": 51.4260,
        "longitude": -0.1620,
        "price": 1300,
        "bedrooms": 2,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Near Tooting Bec Lido",
            "Large double bedrooms",
            "Storage",
            "EPC Rating D",
            "Unfurnished",
            "Near Northern line"
        ],
        "description": "A spacious two-bedroom flat on Mitcham Lane in Tooting, offering great value in a family-friendly area. Tooting Bec station (Northern line) connects to the City and West End in under 25 minutes. The famous Tooting Market and the wide range of South Asian restaurants on Tooting High Road make this one of London's most exciting foodie destinations."
    },
    {
        "listing_title": "7 King Street, London, W6",
        "location": "7 King Street, Hammersmith, London, W6 9JU",
        "postcode": "W6",
        "latitude": 51.4920,
        "longitude": -0.2230,
        "price": 1600,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Near River Thames",
            "Modern kitchen",
            "Private balcony",
            "EPC Rating C",
            "Furnished",
            "Near Hammersmith Apollo"
        ],
        "description": "A well-presented one-bedroom flat on King Street in Hammersmith, close to the Thames riverside. Hammersmith station (Piccadilly, District, and Hammersmith & City lines) connects to central London in 15 minutes. The area offers excellent entertainment at the Hammersmith Apollo and riverside pubs, plus the peaceful Furnivall Gardens and Thames Path."
    },
    {
        "listing_title": "19 Old Street, London, EC2A",
        "location": "19 Old Street, Shoreditch, London, EC2A 2PT",
        "postcode": "EC2A",
        "latitude": 51.5240,
        "longitude": -0.0790,
        "price": 1650,
        "bedrooms": 1,
        "bathrooms": 1,
        "property_type": "Flat",
        "amenities": [
            "Shoreditch location",
            "Exposed brickwork",
            "Modern fit-out",
            "EPC Rating C",
            "Furnished",
            "Near Silicon Roundabout"
        ],
        "description": "A stylish one-bedroom flat on Old Street in Shoreditch, at the epicentre of London's tech and creative scene. Old Street station (Northern line) connects to the City in 3 minutes and the West End in under 10. The area is renowned for its street art, independent galleries, and vibrant nightlife, with Boxpark and the Curtain Road bars all within easy reach."
    },
]


def build_record(idx, prop):
    """Build a single JSONL record from the property data."""
    listing_id = 900001 + idx
    agency_idx = idx % len(AGENCIES)
    phone_idx = idx % len(PHONE_NUMBERS)

    # Bedrooms label for listing title
    if prop["bedrooms"] == 0:
        bed_label = "Studio"
    else:
        bed_label = f"{prop['bedrooms']} Bed"

    return {
        "web_scraper_start_url": BASE_URL,
        "listing_url": f"https://www.rightmove.co.uk/properties/{listing_id}#/?channel=RES_LET",
        "listing_title": prop["listing_title"],
        "listing_id": listing_id,
        "price": prop["price"],
        "currency": "gbp",
        "listing_status": "",
        "property_type": prop["property_type"],
        "location": prop["location"],
        "latitude": prop["latitude"],
        "longitude": prop["longitude"],
        "bedrooms": prop["bedrooms"],
        "bathrooms": prop["bathrooms"],
        "size_m2": "",
        "tenure": "",
        "amenities": prop["amenities"],
        "description": prop["description"],
        "images_script": "",
        "agency_name": AGENCIES[agency_idx],
        "agent_phone_number": PHONE_NUMBERS[phone_idx],
        "next_page": "",
    }


def main():
    # Count existing lines
    existing_count = 0
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    existing_count += 1

    print(f"Existing records: {existing_count}")

    # Append new records
    records = [build_record(i, p) for i, p in enumerate(properties)]

    with open(OUTPUT_FILE, "a", encoding="utf-8") as f:
        for rec in records:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")

    print(f"Appended {len(records)} new mock properties.")

    # Verify by counting total and showing distribution
    total = 0
    prices = []
    bedroom_counts = {}
    areas = []

    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            total += 1
            try:
                obj = json.loads(line)
                prices.append(obj.get("price", 0))
                beds = obj.get("bedrooms", 0)
                bedroom_counts[beds] = bedroom_counts.get(beds, 0) + 1
                loc = obj.get("location", "")
                # Extract postcode area from location
                parts = loc.split(", ")
                if parts:
                    areas.append(parts[-1] if parts else "unknown")
            except json.JSONDecodeError:
                pass

    print(f"\nTotal records in file: {total}")
    print(f"\nPrice distribution:")
    print(f"  Min:    {min(prices)}")
    print(f"  Max:    {max(prices)}")
    print(f"  Mean:   {sum(prices) / len(prices):.0f}")
    print(f"\nBedroom distribution:")
    for beds in sorted(bedroom_counts.keys()):
        label = "Studio" if beds == 0 else f"{beds}-bed"
        print(f"  {label}: {bedroom_counts[beds]}")

    # Show the 35 new ones specifically
    print(f"\n--- Newly added mock properties ---")
    for i, rec in enumerate(records, 1):
        bed = "Studio" if rec["bedrooms"] == 0 else f"{rec['bedrooms']} bed"
        print(f"  {i:2d}. ID {rec['listing_id']} | {bed} | £{rec['price']:,}/mo | {rec['listing_title']}")

    print(f"\nDone. File: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
