#generate random teachers
# 'name': 'Jan Kowalski', 'subject': 'Math', 'price': 105,

import random
import string

subjects = ["Math", "Phis", "Biol", "Chem", "Geog", "Engl", "Germ"]
names = ['Jan', 'Anna', 'Adam', 'Karolina', 'Piotr', 'Tadeusz', 'Pan', 'Juliusz', 'Joanna', 'Janusz', 'Krzysztof', 'Marek', 'Paweł', 'Kamil', 'Kacper', 'Kuba', 'Krzysiek', 'Kasia', 'Karolina', 'Klaudia', 'Kamila']
surnames = ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Wojciechowski', 'Kwiatkowski', 'Krawczyk', 'Kaczmarek', 'Piotrowski', 'Grabowski', 'Zając', 'Pawłowski', 'Michalski', 'Król', 'Nowakowski', 'Witkowski', 'Walczak', 'Stępień', 'Górski', 'Rutkowski', 'Michalak', 'Sikora', 'Ostrowski', 'Baran', 'Duda', 'Szewczyk', 'Tomaszewski', 'Pietrzak', 'Marciniak', 'Wróbel', 'Zalewski', 'Jakubowski', 'Jasiński', 'Zawadzki', 'Sadowski', 'Bąk', 'Chmielewski', 'Włodarczyk', 'Borkowski', 'Czarnecki', 'Sawicki', 'Sokołowski', 'Urbański', 'Kubiak', 'Maciejewski', 'Szczepański', 'Kucharski', 'Wilk', 'Kalinowski', 'Lis', 'Mazurek', 'Wysocki', 'Adamski', 'Kaźmierczak', 'Wasilewski', 'Sobczak', 'Czerwiński', 'Andrzejewski', 'Cieślak', 'Głowacki', 'Zakrzewski', 'Kołodziej', 'Sikorski', 'Krajewski', 'Gajewski', 'Szymczak', 'Szulc', 'Baranowski', 'Laskowski', 'Brzeziński', 'Makowski', 'Ziółkowski', 'Przybylski', 'Domański', 'Nowicki', 'Borowski']
def generate_teachers(times=10):
    id = 0
    teachers = []
    for i in range(times):
        id = id + 1
        name = ''.join(random.choices(names)) + ' ' + ''.join(random.choices(surnames))
        subject = ''.join(random.choices(subjects))
        price = random.randint(40, 160)
        teachers.append({'id': id, 'name': name, 'subject': subject, 'price': price})
    return teachers

print(generate_teachers(50))