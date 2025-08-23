import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function Sergo_Project() {
    return (
        <div className="sergo-container">
            <div className="sergo-header">
                <Link to={'/'}>
                    <i className="fas fa-arrow-left"></i>
                </Link>


                <div className="sergo-title">Ser Gosht</div>
                <i className="fa-solid fa-magnifying-glass"></i>
            </div>

            <h1 className="sergo-heading">Sergo`sht haqida qisqacha...</h1>

            <p className="sergo-text">
                2018 yilda mo‘jazgina oshxonada oddiy qiziqish va yuksak ishonch bilan boshlangan harakatlar – o‘z
                mevasini berdi. Asoschi tomonidan tinim bilmay qilingan mehnatlar samarasi — xodimlar soni 100
                nafardan ortganligi, samimiy 100 000 ziod mijozlar tanlovi, shuningdek filiallar soni yildan yilga
                o‘sishda aks ettiradi.
            </p>

            <p className="sergo-text">
                Mana yillar o‘tidiki oilaviy qadriyatlarga amal qilgan holda, taomlarni tayyorlash mahoratimizni
                rivojlantirib bormoqdamiz. Avvaliga 1gina maxsulotdan boshlangan bo‘lsa – hozirda keng tanlovli
                assortimentga ega bo‘lingan. Barcha uchun qayg‘urib betakror muhitni yaratmoqdamiz.
            </p>

            <p className="sergo-text">
                7 yoshdan – 70 yoshgacha har qanday mehmonlarimizga samimiy munosabat bildirgan holda, taomlarimiz eng
                yuqori sifatdagi tabiiy maxsulotlardan va standartlar asosida tayyorlanishini kafolatlaymiz.
            </p>
            <Footer/>
        </div>
    );
}