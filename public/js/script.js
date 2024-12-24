// require('dotenv').config();
// ตัวแปรเก็บสถานะการจอง
const reservations = {}; // {'YYYY-MM-DD-HH:00': totalGuests}

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("date");
    const timeSelect = document.getElementById("time");
    const statusDiv = document.getElementById("status");

    // กำหนดวันปัจจุบัน
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];
    dateInput.setAttribute("min", currentDate);

    // อัปเดตตัวเลือกเวลา
    dateInput.addEventListener("change", function () {
        updateTimeOptions();
        checkDayAvailability();  // ตรวจสอบวันหยุด (วันจันทร์และวันอาทิตย์)
    });

    // ตรวจสอบวันอาทิตย์และวันจันทร์
    function checkDayAvailability() {
        const selectedDate = dateInput.value;
        if (!selectedDate) return; // ถ้ายังไม่ได้เลือกวันที่ไม่ต้องทำอะไร

        const selectedDay = new Date(selectedDate).getDay(); // 0 = Sunday, 1 = Monday, 2-6 = Tuesday to Saturday
        if (selectedDay === 0 || selectedDay === 1) {
            alert("Chilli and Garlic is Close on Sunday - Monday Please choose another day");
            dateInput.value = ""; // เคลียร์วันที่ที่เลือก
        }
    }

    function updateTimeOptions() {
        const selectedDate = dateInput.value;
        if (!selectedDate) return;

        const timeSlots = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
        timeSelect.innerHTML = ""; // เคลียร์ options เดิม
        statusDiv.innerHTML = ""; // ล้างสถานะ

        timeSlots.forEach((time) => {
            const key = `${selectedDate}-${time}`;
            const booked = reservations[key] || 0;
            const available = 8 - booked;

            const option = document.createElement("option");
            option.value = time;
            option.textContent = `${time} - ${available > 0 ? available + " seats available" : "Fully Booked"}`;

            if (available === 0) {
                option.disabled = true; // ปิดเวลาที่เต็ม
            }
            timeSelect.appendChild(option);
        });
    }

    // ฟังก์ชันแปลงเวลาให้เป็นชั่วโมงเต็ม
    function getTimeSlotKey(date, time) {
        const [hours, minutes] = time.split(":").map(Number);
        const roundedTime = `${String(hours).padStart(2, "0")}:00`; // ปัดเวลามาเป็นต้นชั่วโมง
        return `${date}-${roundedTime}`;
    }

    // Event เมื่อทำการจอง
    document.getElementById("reservation-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const date = dateInput.value;
        const time = timeSelect.value;
        const guests = parseInt(document.getElementById("guests").value, 10);

        if (!name || !email || !phone || !date || !time || !guests) {
            alert("Please fill in all fields.");
            return;
        }

        // ตรวจสอบว่าเวลาที่เลือกอยู่ในช่วง 16:00 - 21:00 หรือไม่
        const [hours, minutes] = time.split(":").map(Number);
        if (hours < 16 || (hours === 21 && minutes > 0) || hours > 21) {
            alert("Reservations are only available between 16:00 and 21:00.");
            return;
        }

        // แปลงเวลาเป็นคีย์ที่ถูกต้อง (เช่น 20:01 -> 20:00)
        const reservationKey = getTimeSlotKey(date, time);

        if (!reservations[reservationKey]) reservations[reservationKey] = 0;

        if (reservations[reservationKey] + guests > 8) {
            alert("This hours time slot is fully booked. Please choose another hours time.");
            updateTimeOptions();
            return;
        }

        // อัปเดตสถานะการจอง
        reservations[reservationKey] += guests;

        // ส่งข้อมูลไปยัง EmailJS
        emailjs.init("Vb78zKsE0g5OMGKeo"); // Replace with your Public Key
        const emailParams = {
            user_name: name,
            user_email: email,
            user_phone: phone,
            reservation_date: date,
            reservation_time: time,
            number_of_guests: guests,
        };

        emailjs.send("Chilli_n_Garlic", "template_375sbwi", emailParams).then(
            function () {
                alert(
                    `Reservation confirmed! Your reservation for ${guests} guest(s) on ${date} at ${time} has been made.`
                );
                document.getElementById("reservation-form").reset();
                updateTimeOptions();
            },
            function (error) {
                console.error("Failed to send email:", error);
                alert("Failed to send confirmation email. Please try again.");
            }
        );
    });
});
