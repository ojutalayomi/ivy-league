for (let i = 0; i < 1000000 * 5; i++) {
    fetch(
        "http://192.168.141.216:5001/signup?api-key=AyomideEmmanuel", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Mr",
                firstname: "noreply"+i,
                lastname: "atyu"+i,
                email: `${i}jhgfdfghj${i}k@gmail.com`,
                dob: new Date().toISOString(),
                phone: "1234567890"+i,
                password: i+"Ayomide2003."+i,
                gender: "male"
            })
        }
    )
    console.log("Request sent. No %i", i)
}