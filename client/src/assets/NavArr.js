// creating an array of navbar items with multiple options and a dropdown menu
// to be used in the Navbar component it include the following items:
// an array of objects with the following properties:
// name: the name of the item
// icon: the icon of the item

export let NavArr = [
    {
        name: "Home",
        icon: "fa fa-home", // Font Awesome icon for home
        dropdown: [] // No dropdown items for "Home"
    },
    {
        name: "About",
        icon: "fa fa-info-circle", // Font Awesome icon for info
        dropdown: [] // No dropdown items for "About"
    },
    {
        name: "Services",
        icon: "fa fa-cogs", // Font Awesome icon for services (gears/cogs)
        dropdown: [
            { name: "Web Development", icon: "fa fa-code" }, // Font Awesome icon for code
            { name: "App Development", icon: "fa fa-mobile-alt" }, // Font Awesome icon for mobile development
            { name: "SEO Optimization", icon: "fa fa-search" } // Font Awesome icon for search/SEO
        ]
    },
    {
        name: "Products",
        icon: "fa fa-shopping-cart", // Font Awesome icon for shop
        dropdown: [
            { name: "Clothing", icon: "fa fa-tshirt" }, // Font Awesome icon for clothing
            { name: "Electronics", icon: "fa fa-laptop" } // Font Awesome icon for electronics
        ]
    },
    {
        name: "Contact",
        icon: "fa fa-phone", // Font Awesome icon for phone
        dropdown: [] // No dropdown items for "Contact"
    }
];
