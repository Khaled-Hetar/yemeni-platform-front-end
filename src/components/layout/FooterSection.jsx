import React from 'react';
import { Link } from 'react-router-dom';

const FooterSection = ({ title, items }) => (
  <div>
    <h6 className="text-cyan-600 text-xl font-bold pt-2 pb-2">{title}</h6>
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          <Link to={item.link} className="block py-1 text-neutral-600 hover:text-cyan-600 transition cursor-pointer">
            {item.text}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterSection;
