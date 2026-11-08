(function() {
  'use strict';

  // Embedded university list - ALL South African universities
  var UNIVERSITIES = [
    {"name": "Cape Peninsula University of Technology", "abbreviation": "CPUT", "website": "https://www.cput.ac.za", "location": "Western Cape", "campuses": ["Bellville", "Cape Town", "Mowbray", "Wellington", "Granger Bay"]},
    {"name": "Nelson Mandela University", "abbreviation": "NMU", "website": "https://www.mandela.ac.za", "location": "Eastern Cape", "campuses": ["George", "North Campus", "South Campus", "Missionvale"]},
    {"name": "North-West University", "abbreviation": "NWU", "website": "https://www.nwu.ac.za", "location": "North West", "campuses": ["Mahikeng", "Potchefstroom", "Vanderbijlpark"]},
    {"name": "Rhodes University", "abbreviation": "RU", "website": "https://www.ru.ac.za", "location": "Eastern Cape", "campuses": ["Grahamstown"]},
    {"name": "Stellenbosch University", "abbreviation": "SU", "website": "https://www.sun.ac.za", "location": "Western Cape", "campuses": ["Stellenbosch", "Tygerberg", "Saldanha"]},
    {"name": "Tshwane University of Technology", "abbreviation": "TUT", "website": "https://www.tut.ac.za", "location": "Gauteng", "campuses": ["Pretoria", "Soshanguve", "Ga-Rankuwa", "eMalahleni", "Mbombela", "Polokwane"]},
    {"name": "University of Cape Town", "abbreviation": "UCT", "website": "https://www.uct.ac.za", "location": "Western Cape", "campuses": ["Rondebosch"]},
    {"name": "University of Fort Hare", "abbreviation": "UFH", "website": "https://www.ufh.ac.za", "location": "Eastern Cape", "campuses": ["Alice", "East London", "Bhisho"]},
    {"name": "University of the Free State", "abbreviation": "UFS", "website": "https://www.ufs.ac.za", "location": "Free State", "campuses": ["Bloemfontein", "Qwaqwa"]},
    {"name": "University of Johannesburg", "abbreviation": "UJ", "website": "https://www.uj.ac.za", "location": "Gauteng", "campuses": ["APK", "APB", "DFC", "SWC"]},
    {"name": "University of Limpopo", "abbreviation": "UL", "website": "https://www.ul.ac.za", "location": "Limpopo", "campuses": ["Turfloop", "Medunsa"]},
    {"name": "University of Mpumalanga", "abbreviation": "UMP", "website": "https://www.ump.ac.za", "location": "Mpumalanga", "campuses": ["Mbombela", "Siyabuswa"]},
    {"name": "University of Pretoria", "abbreviation": "UP", "website": "https://www.up.ac.za", "location": "Gauteng", "campuses": ["Hatfield", "Groenkloof", "Prinshof", "Onderstepoort"]},
    {"name": "University of Venda", "abbreviation": "Univen", "website": "https://www.univen.ac.za", "location": "Limpopo", "campuses": ["Thohoyandou"]},
    {"name": "Vaal University of Technology", "abbreviation": "VUT", "website": "https://www.vut.ac.za", "location": "Gauteng", "campuses": ["Vanderbijlpark"]},
    {"name": "Walter Sisulu University", "abbreviation": "WSU", "website": "https://www.wsu.ac.za", "location": "Eastern Cape", "campuses": ["Mthatha", "Buffalo City", "Butterworth", "Komani"]},
    {"name": "University of the Witwatersrand", "abbreviation": "Wits", "website": "https://www.wits.ac.za", "location": "Gauteng", "campuses": ["Braamfontein", "Parktown"]}
  ];

  window.ALL_UNIVERSITIES = UNIVERSITIES;

  // NWU Courses
  var NWU_COURSES = [
    {name:"Diploma in Coaching Science",duration:"2 years",apsRequired:18,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Health Sciences in Sport Coaching",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Health Sciences in Human Movement Science",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Health Sciences in Recreation Science",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Health Sciences in Biokinetics",duration:"4 years",apsRequired:32,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%) OR Mathematical Literacy: Level 4 (50-59%)","Physical Sciences OR Life Sciences: Level 4 (50-59%)"]},
    {name:"Bachelor of Pharmacy",duration:"4 years",apsRequired:32,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)","Physical Sciences: Level 5 (60-69%)"]},
    {name:"Bachelor of Health Sciences in Physiology",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)","Physical Sciences: Level 4 (50-59%)"]},
    {name:"Bachelor of Consumer Studies in Food Product Management",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Consumer Studies in Fashion Retail Management",duration:"4 years",apsRequired:24,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Dietetics",duration:"4 years",apsRequired:30,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)","Physical Sciences: Level 5 (60-69%)"]},
    {name:"Bachelor of Health Sciences in Occupational Hygiene",duration:"4 years",apsRequired:27,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)","Physical Sciences: Level 5 (60-69%)"]},
    {name:"Bachelor of Arts in Psychology",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%) OR Mathematical Literacy: Level 5 (60-69%)"]},
    {name:"Bachelor of Social Science in Psychology",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Social Work",duration:"4 years",apsRequired:28,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Nursing",duration:"4 years",apsRequired:25,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Physical Sciences OR Mathematics OR Life Sciences: Level 4 (50-59%)"]},
    {name:"Diploma in Animal Health",duration:"3 years",apsRequired:22,institution:"North-West University",campus:"Mahikeng",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 3 (40-49%)","Physical Science OR Life Science: Level 3 (40-49%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Diploma in Animal Science",duration:"3 years",apsRequired:22,institution:"North-West University",campus:"Mahikeng",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 3 (40-49%)","Physical Science OR Life Science: Level 3 (40-49%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Diploma in Plant Science",duration:"3 years",apsRequired:22,institution:"North-West University",campus:"Mahikeng",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 3 (40-49%)","Physical Science OR Life Science: Level 3 (40-49%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Bachelor of Science in Agricultural Economics",duration:"4 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Science OR Life Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Animal Science",duration:"4 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Science OR Life Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Agronomy",duration:"4 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Science OR Life Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Chemistry",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)","Physical Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Physics",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)","Physical Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Mathematics",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)","Physical Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Computer Science",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)","Physical Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Information Technology",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Biological Sciences",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Environmental Sciences",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Science: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Financial Mathematics",duration:"3 years",apsRequired:32,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 6 (70-79%)"]},
    {name:"Bachelor of Science in Actuarial Science",duration:"3 years",apsRequired:32,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 6 (70-79%)"]},
    {name:"Bachelor of Science in Business Analytics",duration:"3 years",apsRequired:32,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 6 (70-79%)"]},
    {name:"Bachelor of Science in Quantitative Risk Management",duration:"3 years",apsRequired:32,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Natural and Agricultural Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 6 (70-79%)"]},
    {name:"Bachelor of Commerce in Accounting",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Bachelor of Commerce in Chartered Accountancy",duration:"3 years",apsRequired:32,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)"]},
    {name:"Bachelor of Commerce in Forensic Accountancy",duration:"3 years",apsRequired:36,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 5 (60-69%)","Mathematics: Level 5 (60-69%)"]},
    {name:"Bachelor of Commerce in Management Accountancy",duration:"3 years",apsRequired:30,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 5 (60-69%)"]},
    {name:"Bachelor of Commerce in Financial Accountancy",duration:"3 years",apsRequired:28,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Commerce in Economics",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Commerce in Business Management",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Bachelor of Commerce in Marketing Management",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Bachelor of Commerce in Human Resource Management",duration:"3 years",apsRequired:30,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Commerce in Industrial Psychology",duration:"3 years",apsRequired:30,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Commerce in Logistics Management",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Bachelor of Commerce in Transport Economics",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Bachelor of Commerce in Risk Management",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Commerce in Tourism Management",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Bachelor of Administration in Public Administration",duration:"3 years",apsRequired:23,institution:"North-West University",campus:"Mahikeng",faculty:"Faculty of Economic and Management Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%) OR Mathematical Literacy: Level 4 (50-59%)"]},
    {name:"Bachelor of Arts in Communication",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Humanities",requirements:["English: Level 5 (60-69%)"]},
    {name:"Bachelor of Arts in Graphic Design",duration:"4 years",apsRequired:24,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Humanities",requirements:["English: Level 5 (60-69%)"]},
    {name:"Bachelor of Arts in Public Governance",duration:"3 years",apsRequired:25,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Arts in Languages",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Philosophy in Philosophy, Politics and Economics",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Social Sciences in Development Studies",duration:"3 years",apsRequired:22,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Social Sciences in Political Studies",duration:"3 years",apsRequired:24,institution:"North-West University",campus:"Mahikeng",faculty:"Faculty of Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Arts in Industrial Psychology",duration:"3 years",apsRequired:26,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Humanities",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)"]},
    {name:"Bachelor of Education in Foundation Phase",duration:"4 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","Home Language: Level 4 (50-59%)"]},
    {name:"Bachelor of Education in Intermediate Phase",duration:"4 years",apsRequired:26,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","Home Language: Level 4 (50-59%)"]},
    {name:"Bachelor of Education in Senior Phase",duration:"4 years",apsRequired:26,institution:"North-West University",campus:"Mahikeng, Potchefstroom, Vanderbijlpark",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","Home Language: Level 4 (50-59%)"]},
    {name:"Bachelor of Engineering in Chemical Engineering",duration:"4 years",apsRequired:34,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Engineering",requirements:["English: Level 5 (60-69%)","Mathematics: Level 6 (70-79%)","Physical Sciences: Level 6 (70-79%)"]},
    {name:"Bachelor of Engineering in Electrical Engineering",duration:"4 years",apsRequired:34,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Engineering",requirements:["English: Level 5 (60-69%)","Mathematics: Level 6 (70-79%)","Physical Sciences: Level 6 (70-79%)"]},
    {name:"Bachelor of Engineering in Mechanical Engineering",duration:"4 years",apsRequired:34,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Engineering",requirements:["English: Level 5 (60-69%)","Mathematics: Level 6 (70-79%)","Physical Sciences: Level 6 (70-79%)"]},
    {name:"Bachelor of Engineering in Industrial Engineering",duration:"4 years",apsRequired:34,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Engineering",requirements:["English: Level 5 (60-69%)","Mathematics: Level 6 (70-79%)","Physical Sciences: Level 6 (70-79%)"]},
    {name:"Bachelor of Engineering in Mechatronic Engineering",duration:"4 years",apsRequired:34,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Engineering",requirements:["English: Level 5 (60-69%)","Mathematics: Level 6 (70-79%)","Physical Sciences: Level 6 (70-79%)"]},
    {name:"Bachelor of Laws",duration:"4 years",apsRequired:34,institution:"North-West University",campus:"Mahikeng, Potchefstroom",faculty:"Faculty of Law",requirements:["English: Level 5 (60-69%)","Mathematics: Level 3 (40-49%) OR Mathematical Literacy: Level 5 (60-69%)"]},
    {name:"Bachelor of Arts in Law",duration:"3 years",apsRequired:30,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Law",requirements:["English: Level 5 (60-69%)","Mathematics: Level 3 (40-49%) OR Mathematical Literacy: Level 5 (60-69%)"]},
    {name:"Bachelor of Commerce in Law",duration:"3 years",apsRequired:34,institution:"North-West University",campus:"Potchefstroom, Vanderbijlpark",faculty:"Faculty of Law",requirements:["English: Level 5 (60-69%)","Mathematics: Level 3 (40-49%)"]},
    {name:"Bachelor of Divinity",duration:"4 years",apsRequired:24,institution:"North-West University",campus:"Potchefstroom",faculty:"Faculty of Theology",requirements:["English: Level 4 (50-59%)"]}
  ];

  // UFH Courses
  var UFH_COURSES = [
    {name:"Bachelor of Education in Agriculture",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)","Agricultural Science: Level 4 (50-59%)","Life Sciences: Level 4 (50-59%)"]},
    {name:"Bachelor of Education in Commerce",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%) OR Mathematical Literacy: Level 4 (50-59%)","Accounting OR Economics OR Business Studies: Level 4 (50-59%)"]},
    {name:"Bachelor of Education in Science",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Science OR Life Science OR Geography: Level 4 (50-59%)"]},
    {name:"Bachelor of Education in Social Science",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","isiXhosa OR Afrikaans: Level 4 (50-59%)","History OR Geography: Level 4 (50-59%)"]},
    {name:"Bachelor of Education in Foundation Phase",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)","isiXhosa OR Afrikaans: Level 4 (50-59%)"]},
    {name:"Bachelor of Education in Intermediate Phase",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Education",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)","isiXhosa OR Afrikaans: Level 4 (50-59%)"]},
    {name:"Bachelor of Laws",duration:"4 years",apsRequired:30,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Law",requirements:["English: Level 4 (50-59%)","Mathematics: Level 3 (40-49%) OR Mathematical Literacy: Level 4 (50-59%)"]},
    {name:"Bachelor of Commerce in Law",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Law",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)"]},
    {name:"Bachelor of Health Sciences in Human Movement Science",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)","Life Sciences: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Speech Language Pathology",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)","Physical Science: Level 4 (50-59%)","Life Sciences: Level 4 (50-59%)"]},
    {name:"Bachelor of Nursing",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Health Sciences",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)","Physical Science: Level 4 (50-59%)","Life Sciences: Level 4 (50-59%)"]},
    {name:"Bachelor of Administration in Public Administration",duration:"3 years",apsRequired:26,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Management and Commerce",requirements:["English: Level 4 (50-59%)","Mathematics: Level 2 (30-39%) OR Mathematical Literacy: Level 4 (50-59%)"]},
    {name:"Bachelor of Commerce",duration:"3 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Management and Commerce",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Commerce in Accounting",duration:"3 years",apsRequired:32,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Management and Commerce",requirements:["English: Level 5 (60-69%)","Mathematics: Level 5 (60-69%)"]},
    {name:"Bachelor of Commerce in Information Systems",duration:"3 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Management and Commerce",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)"]},
    {name:"Bachelor of Arts",duration:"3 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Fine Art",duration:"3 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Library and Information Science",duration:"3 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Music",duration:"3 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Social Science",duration:"3 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Social Science in Communication",duration:"3 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Social Science in Human Settlement",duration:"3 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Social Work",duration:"4 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Theology",duration:"3 years",apsRequired:27,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Social Science and Humanities",requirements:["English: Level 4 (50-59%)"]},
    {name:"Bachelor of Science",duration:"3 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice, East London",faculty:"Faculty of Science and Agriculture",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Sciences: Level 4 (50-59%)","Life Sciences OR Geography OR Agriculture: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Agricultural Economics",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Science and Agriculture",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Life Sciences: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Animal Science",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Science and Agriculture",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Sciences: Level 4 (50-59%)","Life Sciences OR Agriculture: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Soil Science",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Science and Agriculture",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Sciences: Level 4 (50-59%)","Life Sciences OR Agriculture: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Horticulture",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Science and Agriculture",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Sciences: Level 4 (50-59%)","Life Sciences OR Agriculture: Level 4 (50-59%)"]},
    {name:"Bachelor of Science in Plant Breeding",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Science and Agriculture",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%)","Physical Sciences: Level 4 (50-59%)","Life Sciences OR Agriculture: Level 4 (50-59%)"]},
    {name:"Bachelor of Agriculture",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Science and Agriculture",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)","Agriculture: Level 4 (50-59%)"]},
    {name:"Bachelor of Agriculture in Agricultural Extension",duration:"4 years",apsRequired:28,institution:"University of Fort Hare",campus:"Alice",faculty:"Faculty of Science and Agriculture",requirements:["English: Level 4 (50-59%)","Mathematics: Level 4 (50-59%) OR Mathematical Literacy: Level 5 (60-69%)","Agriculture: Level 4 (50-59%)"]}
  ];

  // UFS Courses
  var UFS_COURSES = [
  {
    "name": "BCom",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "BCom with specialisation in Economics",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "BCom with specialisation in Finance",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "BCom with specialisation in Business Analytics",
    "duration": "3 years",
    "apsRequired": 34,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)"
    ]
  },
  {
    "name": "BCom with specialisation in Marketing",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 3 (40%)"
    ]
  },
  {
    "name": "BCom with specialisation in Business Management",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 3 (40%)"
    ]
  },
  {
    "name": "BCom with specialisation in Human Resource Management",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 3 (40%)"
    ]
  },
  {
    "name": "BCom (Law)",
    "duration": "3 years",
    "apsRequired": 33,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "BAdmin",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 3 (30%)"
    ]
  },
  {
    "name": "BAcc",
    "duration": "3 years",
    "apsRequired": 34,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)"
    ]
  },
  {
    "name": "BCom (Accounting)",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "BCom with specialisation in Management",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Administration",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Economic and Management Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 2 (30%)"
    ]
  },
  {
    "name": "BEd Foundation Phase - Afrikaans Home Language",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Afrikaans Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Foundation Phase - Sesotho Home Language",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein, Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Foundation Phase - Sesotho Home Language",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Foundation Phase - isiZulu Home Language",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "isiZulu Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Foundation Phase - English Home Language",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Afrikaans Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Mathematics, Natural Sciences, Technology, Afrikaans HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)",
      "Afrikaans Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Life Skills, Social Sciences, Afrikaans HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Afrikaans Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Mathematics, Natural Sciences, Technology, English HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)",
      "Afrikaans First Additional Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Life Skills, Social Sciences, English HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Afrikaans First Additional Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Mathematics, Natural Sciences, Technology, Sesotho HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein, Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Mathematics, Natural Sciences, Technology, Sesotho HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Life Skills, Social Sciences, isiZulu HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "isiZulu Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Life Skills, Social Sciences, Sesotho HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein, Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Life Skills, Social Sciences, Sesotho HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Intermediate Phase - Mathematics, Natural Sciences, Technology, isiZulu HL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)",
      "isiZulu Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Accounting and Business Studies",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)",
      "Accounting: Level 4 (50%)",
      "Business Studies: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - EMS and Accounting",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)",
      "Accounting: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Technology and Engineering Graphics and Design",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Engineering Graphics and Design: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Life Sciences and Mathematics",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein, Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Life Sciences and Mathematics",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Technology and Life Sciences",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Life Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Sesotho HL and English FAL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein, Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Sesotho HL and English FAL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - isiZulu HL and English FAL",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "isiZulu Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Mathematics and Physical Sciences",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein, Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Mathematics and Physical Sciences",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Sesotho HL and History",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein, Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Sesotho HL and History",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Sesotho Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - isiZulu HL and History",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "isiZulu Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - English and History",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Afrikaans HL and English",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Afrikaans Home Language: Level 4 (50%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Geography and Life Sciences",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein, Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 3 (40%)",
      "Geography: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BEd Senior Phase - Geography and Life Sciences",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Education",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 3 (40%)",
      "Geography: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "Bachelor of Medical Science (Radiation Science)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 5 (60%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "Bachelor of Medicine and Bachelor of Surgery (MB ChB)",
    "duration": "3 years",
    "apsRequired": 36,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 5 (60%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "Bachelor of Optometry",
    "duration": "3 years",
    "apsRequired": 33,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 5 (60%)",
      "Mathematics: Level 4 (50%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Physiotherapy",
    "duration": "3 years",
    "apsRequired": 33,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 5 (60%)",
      "Mathematics: Level 4 (50%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 4 (50%)"
    ]
  },
  {
    "name": "BSc Dietetics",
    "duration": "3 years",
    "apsRequired": 33,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 5 (60%)",
      "Mathematics: Level 4 (50%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Occupational Therapy",
    "duration": "3 years",
    "apsRequired": 33,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 5 (60%)",
      "Mathematics: Level 4 (50%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Biokinetics",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 5 (60%)",
      "Mathematics: Level 4 (50%)",
      "Life Sciences: Level 4 (50%)",
      "Physical Sciences: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Sport Coaching",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Nursing",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Health Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Life Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "Bachelor of Laws (LLB)",
    "duration": "3 years",
    "apsRequired": 33,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Law",
    "requirements": [
      "English: Level 6 (70%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Behavioural Genetics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Biochemistry and Botany",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Biochemistry and Entomology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Biochemistry and Genetics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Biochemistry and Microbiology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Biochemistry and Physiology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Biochemistry and Statistics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Biochemistry and Zoology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Biodiversity and Conservation Ecology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Botany and Entomology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Botany and Genetics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Botany and Microbiology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Botany and Plant Breeding",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Botany and Plant Pathology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Botany and Zoology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Entomology and Genetics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Entomology and Microbiology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Entomology and Zoology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Genetics and Microbiology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Genetics and Physiology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Genetics and Zoology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Microbiology and Statistics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Microbiology and Zoology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Plant Health Ecology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Plant Health Management",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Forensic Science",
    "duration": "3 years",
    "apsRequired": 34,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Life Sciences: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Mathematical Sciences - Mathematics and Applied Mathematics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Mathematical Sciences - Mathematics and Chemistry",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Mathematical Sciences - Mathematics and Mathematical Statistics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Mathematical Sciences - Mathematics and Physics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Actuarial Science",
    "duration": "3 years",
    "apsRequired": 34,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)"
    ]
  },
  {
    "name": "BSc Mathematical Statistics - Climate Sciences",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Mathematical Statistics - Econometrics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)"
    ]
  },
  {
    "name": "BSc Mathematical Statistics - Mathematical Statistics and Psychometrics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)"
    ]
  },
  {
    "name": "BSc Mathematical Statistics - Statistics and Economics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Mathematical Statistics - Statistics and Psychology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Chemical Sciences - Chemistry and Biochemistry",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Chemical Sciences - Chemistry and Botany",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Chemical Sciences - Chemistry and Microbiology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Chemical Sciences - Chemistry and Physics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Physical Sciences - Physics and Agrometeorology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Physical Sciences - Physics and Astrophysics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Physical Sciences with Engineering - Physics and Engineering Subjects",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BEng Agricultural and Biosystems Engineering",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geography - Geography and Environmental Science",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geography - Geography Specialisation",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Environmental Soil Science",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geology - Geology and Chemistry",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geology - Environmental Geology",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geology - Geochemistry",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geology - Geology",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geology - Geology and Physics",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Agricultural Economics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Computer Science and Chemistry",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Computer Science and Mathematical Statistics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Computer Science and Mathematics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Computer Science and Physics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Data Science",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 6 (70%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Computer Science and Business Management",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Computer Information Systems",
    "duration": "3 years",
    "apsRequired": 33,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Sustainable Food Systems",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BAgric - Agricultural Extension",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BAgric - Animal Production Management",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BAgric - Crop Production",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BAgric - Mixed Farming Management",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BAgric - Irrigation Management",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 3 (40%)"
    ]
  },
  {
    "name": "BAgric - Agricultural Economics",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "BAgric - Agricultural Management",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BSc Agriculture - Animal Science",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Agriculture - Agrometeorology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Agriculture - Agronomy",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Agriculture - Plant Breeding",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Agriculture - Plant Pathology",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Agriculture - Soil Science",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "Bachelor of Architecture",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 4 (50%)"
    ]
  },
  {
    "name": "BSc Construction Economics and Management (Full-time)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Construction Management (Compact Learning)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Quantity Surveying (Compact Learning)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Computer Science and Chemistry",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Computer Science and Physics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc IT - Computer Science and Management",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 4 (50%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Botany and Life Sciences",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Life Sciences",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Biological Sciences - Zoology and Life Sciences",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Chemical and Physical Sciences - Chemistry and Physics",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Chemical and Physical Sciences - Chemistry and Botany",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geography - Geography and Environmental Geography",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "BSc Geography - Geography",
    "duration": "3 years",
    "apsRequired": 32,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Natural and Agricultural Sciences",
    "requirements": [
      "English: Level 4 (50%)",
      "Mathematics: Level 5 (60%)",
      "Life Sciences: Level 5 (60%)",
      "Physical Sciences: Level 5 (60%)"
    ]
  },
  {
    "name": "Higher Certificate in Music Performance",
    "duration": "3 years",
    "apsRequired": 20,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "Diploma in Music",
    "duration": "3 years",
    "apsRequired": 25,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "Advanced Diploma in Music",
    "duration": "3 years",
    "apsRequired": 0,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": []
  },
  {
    "name": "Advanced Diploma in Opera Studies",
    "duration": "3 years",
    "apsRequired": 0,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": []
  },
  {
    "name": "BA (Language Practice)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 5 (60%)"
    ]
  },
  {
    "name": "BA (Governance and Political Transformation)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BA (Integrated Organisational Communication)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": []
  },
  {
    "name": "BA (Journalism)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": []
  },
  {
    "name": "BA (Fine Arts)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BA (Drama and Theatre Arts)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": []
  },
  {
    "name": "BA General",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BA specialising in Languages",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Music",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BA (Music)",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "BSocSci",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Social Work",
    "duration": "3 years",
    "apsRequired": 35,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 5 (60%)"
    ]
  },
  {
    "name": "BA General",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Community Development",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 5 (60%)"
    ]
  },
  {
    "name": "BSocSci",
    "duration": "3 years",
    "apsRequired": 30,
    "institution": "University of the Free State",
    "campus": "Qwaqwa",
    "faculty": "Faculty of Humanities",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  },
  {
    "name": "Bachelor of Divinity",
    "duration": "3 years",
    "apsRequired": 28,
    "institution": "University of the Free State",
    "campus": "Bloemfontein",
    "faculty": "Faculty of Theology and Religion",
    "requirements": [
      "English: Level 4 (50%)"
    ]
  }
];

  // Combine hardcoded courses
  var ALL_COURSES = NWU_COURSES.concat(UFH_COURSES).concat(UFS_COURSES);

  // Populate GO_COURSES immediately with hardcoded data
  if (!window.GO_COURSES) window.GO_COURSES = {};
  ALL_COURSES.forEach(function(c) {
    var inst = c.institution;
    if (!window.GO_COURSES[inst]) window.GO_COURSES[inst] = [];
    window.GO_COURSES[inst].push(c);
  });

  console.log('[ProspectusLoader] Embedded data loaded: NWU=' + NWU_COURSES.length + ', UFH=' + UFH_COURSES.length + ', UFS=' + UFS_COURSES.length);
  console.log('[ProspectusLoader] Total hardcoded courses: ' + ALL_COURSES.length);

  // Dynamic JSON loader for remaining universities
  var INSTITUTION_NAMES = {
    'cput': 'Cape Peninsula University of Technology',
    'nmu': 'Nelson Mandela University',
    'nwu': 'North-West University',
    'rhodes': 'Rhodes University',
    'stellenbosch': 'Stellenbosch University',
    'tut': 'Tshwane University of Technology',
    'uct': 'University of Cape Town',
    'ufh': 'University of Fort Hare',
    'ufs': 'University of the Free State',
    'uj': 'University of Johannesburg',
    'ul': 'University of Limpopo',
    'um': 'University of Mpumalanga',
    'univen': 'University of Venda',
    'up': 'University of Pretoria',
    'vut': 'Vaal University of Technology',
    'wsu': 'Walter Sisulu University',
    'wits': 'University of the Witwatersrand'
  };

  // Files to skip (already embedded as hardcoded data)
  var SKIP_FILES = { 'nwu': true, 'ufh': true, 'ufs': true };

  function formatReq(r) {
    var name = r.name || '';
    var level = r.level;
    var percentage = r.percentage;
    var percentageRange = r.percentage_range;

    // Standardize: always show as "Name (Level X)" format
    if (level != null && level !== '') {
      return name + ' (' + level + ')';
    }
    if (percentage != null && percentage !== '') {
      // Convert percentage to level
      var pct = parseInt(percentage);
      var lvl = 0;
      if (pct >= 80) lvl = 7;
      else if (pct >= 70) lvl = 6;
      else if (pct >= 60) lvl = 5;
      else if (pct >= 50) lvl = 4;
      else if (pct >= 40) lvl = 3;
      else if (pct >= 30) lvl = 2;
      else lvl = 1;
      return name + ' (' + lvl + ')';
    }
    if (percentageRange) {
      // Extract first number from range like "50-59%"
      var match = percentageRange.match(/(\d+)/);
      if (match) {
        var pct = parseInt(match[1]);
        var lvl2 = 0;
        if (pct >= 80) lvl2 = 7;
        else if (pct >= 70) lvl2 = 6;
        else if (pct >= 60) lvl2 = 5;
        else if (pct >= 50) lvl2 = 4;
        else if (pct >= 40) lvl2 = 3;
        else if (pct >= 30) lvl2 = 2;
        else lvl2 = 1;
        return name + ' (' + lvl2 + ')';
      }
    }
    return name;
  }

  function normalizeEntry(entry, institutionName) {
    var name = entry.programme || entry.name || '';
    
    // Standardize duration
    var duration = entry.duration || '';
    if (!duration && entry.duration_years) {
      duration = entry.duration_years + ' year' + (entry.duration_years !== 1 ? 's' : '');
    }
    // Clean up duration format
    if (duration && typeof duration === 'number') {
      duration = duration + ' year' + (duration !== 1 ? 's' : '');
    }
    // Remove "Not Specified" or empty
    if (duration === 'Not Specified' || duration === 'not specified') {
      duration = '';
    }

    var apsRequired = 0;
    var entryType = 'aps';
    if (entry.aps != null && entry.aps !== '' && entry.aps !== 0) {
      apsRequired = parseInt(entry.aps, 10) || 0;
      entryType = 'aps';
    } else if (entry.aggregator != null && entry.aggregator !== '' && entry.aggregator !== 0) {
      apsRequired = parseInt(entry.aggregator, 10) || 0;
      entryType = 'aggregator';
    }

    var campus = entry.campus || '';
    if (!campus && entry.campuses && entry.campuses.length > 0) {
      campus = entry.campuses.join(', ');
    }

    var faculty = entry.faculty || '';
    if (faculty && !faculty.toLowerCase().startsWith('faculty')) {
      faculty = 'Faculty of ' + faculty;
    }

    // Handle different requirement structures
    var reqs = entry.requirements || {};
    var compulsory = [];
    var optionalAny = [];

    if (reqs.subjects) {
      compulsory = reqs.subjects.compulsory || [];
      optionalAny = reqs.subjects.optional_any || [];
    } else {
      compulsory = reqs.compulsory || [];
      optionalAny = reqs.optional_any || [];
    }

    var requirements = [];
    compulsory.forEach(function(r) {
      var s = formatReq(r);
      if (s) requirements.push(s);
    });
    if (optionalAny.length > 0) {
      var optParts = optionalAny.map(formatReq).filter(Boolean);
      if (optParts.length > 0) {
        // Show as "Mathematics (3) or Mathematical Literacy (6)"
        requirements.push(optParts.join(' or '));
      }
    }

    return {
      name: name,
      duration: duration,
      apsRequired: apsRequired,
      institution: institutionName,
      campus: campus,
      faculty: faculty,
      requirements: requirements,
      closingDate: entry.closing_date || entry.closingDate || null,
      entryType: entryType
    };
  }

  // Handle filename variations (typos in original repo)
  var FILE_OVERRIDES = {
    'tut': 'tut-prospectus.json'
  };

  var GITHUB_BASE = '/api/prospectus';

  function loadProspectusFile(slug) {
    var institutionName = INSTITUTION_NAMES[slug] || slug;
    var filename = FILE_OVERRIDES[slug] || (slug + '-prospectus.json');
    var url = GITHUB_BASE + '/' + filename;

    return fetch(url)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        // Handle different JSON structures
        var arr = null;
        if (Array.isArray(data)) {
          arr = data;
        } else if (data && Array.isArray(data.programmes)) {
          arr = data.programmes;
        } else if (data && Array.isArray(data.programs)) {
          arr = data.programs;
        } else {
          console.warn('[ProspectusLoader] ' + slug + ': Unexpected data format, keys:', Object.keys(data || {}));
          return 0;
        }
        
        var count = 0;
        arr.forEach(function(entry) {
          var normalized = normalizeEntry(entry, institutionName);
          if (normalized.name) {
            if (!window.GO_COURSES[institutionName]) window.GO_COURSES[institutionName] = [];
            window.GO_COURSES[institutionName].push(normalized);
            count++;
          }
        });
        console.log('[ProspectusLoader] Loaded ' + count + ' courses from ' + slug + ' (' + institutionName + ')');
        return count;
      })
      .catch(function(err) {
        console.error('[ProspectusLoader] Failed to load ' + slug + ' from ' + url + ': ' + err.message);
        return 0;
      });
  }

  // GitHub loading disabled - using UNIVERSITY_DB instead
  console.log('[ProspectusLoader] Hardcoded courses loaded: ' + ALL_COURSES.length);
  console.log('[ProspectusLoader] Skipping GitHub - using UNIVERSITY_DB for additional courses');

  document.dispatchEvent(new CustomEvent('prospectus-loaded', {
    detail: {
      hardcoded: ALL_COURSES.length,
      dynamic: 0,
      total: ALL_COURSES.length,
      universities: Object.keys(window.GO_COURSES)
    }
  }));

  window.ProspectusLoader = {
    ready: true,
    loadAll: function() { return Promise.resolve(window.GO_COURSES); },
    onReady: function(fn) { fn(); }
  };

})();
