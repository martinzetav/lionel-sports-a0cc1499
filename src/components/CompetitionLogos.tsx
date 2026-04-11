import { motion } from "framer-motion";

const competitions = [
  { value: "LPF", img: "https://i.ibb.co/n8NS5Xct/t-lpf-afa9959-logowik-com-Photoroom.png", label: "Liga Profesional" },
  { value: "UEFA", img: "https://i.ibb.co/mrwKqxdd/logo-Photoroom.png", label: "UEFA" },
  { value: "SUDAMERICA", img: "https://i.ibb.co/4g209W1d/6195567-Photoroom.png", label: "Sudamérica" },
  { value: "FIFA", img: "https://i.ibb.co/VW3SMRjC/fifa-official-logo-white-and-blue-symbol-design-abstract-illustration-free-vector-Photoroom.png", label: "FIFA" },
];

interface CompetitionLogosProps {
  active: string;
  onSelect: (value: string) => void;
}

export default function CompetitionLogos({ active, onSelect }: CompetitionLogosProps) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8">
      {competitions.map((comp) => {
        const isActive = active === comp.value;
        return (
          <motion.button
            key={comp.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(isActive ? "" : comp.value)}
            className={`group relative flex h-16 w-16 items-center justify-center rounded-xl p-2 transition-all sm:h-20 sm:w-20 ${
              isActive
                ? "bg-primary/10 ring-2 ring-primary shadow-lg"
                : "bg-muted/50 hover:bg-muted"
            }`}
            title={comp.label}
          >
            <img
              src={comp.img}
              alt={comp.label}
              className={`h-full w-full object-contain transition-all ${
                isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
