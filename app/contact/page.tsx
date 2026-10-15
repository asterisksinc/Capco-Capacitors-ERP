"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { PublicNav } from "@/components/public/PublicChrome";
import { SiteFooter } from "@/components/public/SiteFooter";

type ActiveTab = "general" | "dealership" | "oem" | "export";

const ENQUIRY_TYPES = [
  "Product Catalog & Technical Specifications",
  "Bulk / Commercial Quote Request",
  "Test Compliance & BIS/CE Certificates",
  "OEM Custom Engineering",
  "Export & International Supply",
  "Batch Stock & Availability",
];

const PRODUCT_FAMILIES = [
  "Metalized Polypropylene Film (MPP)",
  "Fan & Motor Capacitors (IS:2993)",
  "Power Factor Correction (PFC - IS:13340)",
  "Luminaire / Lighting Capacitors (IS:1569)",
  "UV Lamp Capacitors",
  "Customized OEM Capacitors",
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const EXPERIENCE_TIERS = [
  "Less than 2 Years",
  "2 - 5 Years",
  "5 - 10 Years",
  "10 - 20 Years",
  "20+ Years",
];

const VOLUME_TIERS = [
  "₹5 Lakhs – ₹15 Lakhs / Year",
  "₹15 Lakhs – ₹50 Lakhs / Year",
  "₹50 Lakhs – ₹1 Crore / Year",
  "₹1 Crore+ / Year",
];

const PRODUCT_LINES_HANDLED = [
  "Capacitors",
  "Water Pumps",
  "HVAC/Cooling",
  "Switchgear/MCB",
  "Motors & Fans",
  "Lighting & APFC",
];

const WAREHOUSE_CAPACITIES = [
  "500+ sq. ft. storage",
  "1,000+ sq. ft. warehouse",
  "Planning facility expansion",
];

const OEM_HOST_SYSTEMS = [
  "HVAC & Air Conditioning Compressors",
  "Submersible & Monoblock Water Pumps",
  "Ceiling & Industrial Ventilation Fans",
  "Washing Machines & Home Appliances",
  "Power Factor Correction (APFC) Panels",
  "LED Drivers & Street Lighting Ballasts",
  "Custom OEM Apparatus",
];

const OEM_CAPACITOR_FAMILIES = [
  "Metalized Polypropylene Film (MPP - Dry Resin)",
  "Oil-Filled Aluminum Can (IS:2993 / IEC 60252)",
  "Box-Type / Snap-In Plastic Case Capacitor",
  "Dual-Value Hermetically Sealed HVAC Capacitor",
  "Heavy-Duty Cylindrical Power Capacitor",
  "Custom Form-Factor / Multi-Pin Assembly",
];

const OEM_VOLTAGES = [
  "230V / 250V AC",
  "400V / 415V AC",
  "440V / 450V AC",
  "480V / 525V AC",
  "Custom Voltage Rating",
];

const OEM_BATCH_SIZES = [
  "5,000 – 25,000 Units / Year",
  "25,000 – 1,00,000 Units / Year",
  "1,00,000 – 5,00,000 Units / Year",
  "5,00,000+ Units / Year (Contract Line)",
];

const OEM_CERTIFICATIONS = [
  "BIS IS:2993 / 13340",
  "UL 810 (US Safety)",
  "CE / IEC 60252-1",
  "RoHS / REACH",
  "GSO / Middle East",
];

const EXPORT_DESTINATIONS = [
  "United Arab Emirates (UAE)",
  "United States of America (USA)",
  "Saudi Arabia (KSA)",
  "Qatar / Oman / Kuwait / Bahrain",
  "Sri Lanka",
  "Bangladesh",
  "Turkey",
  "Egypt",
  "Nigeria / West Africa",
  "Kenya / East Africa",
  "South Africa",
  "Vietnam / ASEAN",
  "European Union (EU)",
  "Other International Destination",
];

const EXPORT_INCOTERMS = [
  "CIF (Port of Discharge)",
  "FOB (Nhava Sheva / Mundra / Chennai)",
  "EXW (Hyderabad Factory)",
  "CFR / C&F (Destination Port)",
  "DDP / DAP (Air / Sea Consignment)",
];

const EXPORT_PAYMENT_INSTRUMENTS = [
  "Irrevocable LC at Sight",
  "TT / Wire Transfer (Advance / BL Copy)",
  "Usance LC (30 / 60 / 90 Days)",
  "CAD (Cash Against Documents)",
];

const EXPORT_CERTIFICATIONS = [
  "GSO / ESMA (GCC Standards)",
  "CE Declaration (Europe)",
  "SONCAP (Nigeria)",
  "TSE (Turkey)",
  "SLS (Sri Lanka)",
];

const enquiryMailto = (subject: string) =>
  `mailto:info@capcocapacitor.com?subject=${encodeURIComponent(subject)}`;

function ChevronDownIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="pointer-events-none shrink-0 text-[#595959]"
    >
      <path
        d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FileUploadIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM13 12V16H11V12H8L12 8L16 12H13Z"
        fill="#59C7E8"
      />
    </svg>
  );
}

function BlueprintToolsIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 text-[#020202]"
    >
      <path
        d="M5.32943 3.27158C6.56252 2.8332 7.9923 3.10749 8.97927 4.09446C10.1002 5.21537 10.3019 6.90741 9.5843 8.23385L20.293 18.9437L18.8788 20.3579L8.16982 9.64875C6.84325 10.3669 5.15069 10.1654 4.02952 9.04421C3.04227 8.05696 2.7681 6.62665 3.20701 5.39332L5.44373 7.63004C6.02952 8.21582 6.97927 8.21582 7.56505 7.63004C8.15084 7.04425 8.15084 6.0945 7.56505 5.50872L5.32943 3.27158ZM15.6968 5.15512L18.8788 3.38736L20.293 4.80157L18.5252 7.98355L16.7574 8.3371L14.6361 10.4584L13.2219 9.04421L15.3432 6.92289L15.6968 5.15512ZM8.97927 13.2868L10.3935 14.7011L5.09018 20.0044C4.69966 20.3949 4.06649 20.3949 3.67597 20.0044C3.31334 19.6417 3.28744 19.0699 3.59826 18.6774L3.67597 18.5902L8.97927 13.2868Z"
        fill="#59C7E8"
      />
    </svg>
  );
}

function LockShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"
        fill="#59C7E8"
      />
    </svg>
  );
}

function SendPlaneIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M3 13.0001H9V11.0001H3V1.8457C3 1.56956 3.22386 1.3457 3.5 1.3457C3.58425 1.3457 3.66714 1.36699 3.74096 1.4076L22.2034 11.562C22.4454 11.695 22.5337 11.9991 22.4006 12.241C22.3549 12.3241 22.2865 12.3925 22.2034 12.4382L3.74096 22.5925C3.499 22.7256 3.19497 22.6374 3.06189 22.3954C3.02129 22.3216 3 22.2387 3 22.1544V13.0001ZM5 19.6172L18.85 12.0001L5 4.38304V9.00008H11V15.0001H5V19.6172Z"
        fill="#020202"
      />
    </svg>
  );
}

function OemEngineerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2 22C2 17.5817 5.58172 14 10 14C10.3387 14 10.6724 14.021 11 14.0619V16.0789C10.6724 16.0268 10.3387 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM17.5 14C19.9853 14 22 16.0147 22 18.5C22 20.9853 19.9853 23 17.5 23C15.0147 23 13 20.9853 13 18.5C13 16.0147 15.0147 14 17.5 14ZM17.5 16C16.1193 16 15 17.1193 15 18.5C15 19.8807 16.1193 21 17.5 21C18.8807 21 20 19.8807 20 18.5C20 17.1193 18.8807 16 17.5 16Z"
        fill="#020202"
      />
    </svg>
  );
}

function FlightTakeoffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M10.478 11.632L5.968 4.56L7.9 4.042L14.851 9.462L20.114 8.052C20.914 7.838 21.737 8.312 21.951 9.113C22.166 9.913 21.691 10.736 20.89 10.95L5.31 15.125L3.369 11.55L4.821 11.161L7.022 12.558L10.478 11.632ZM3 19H21V21H3V19Z"
        fill="#020202"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"
        fill="#59C7E8"
      />
    </svg>
  );
}

function FieldLabel({
  label,
  required = false,
  optionalText,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  optionalText?: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[14px] font-normal leading-[1.2] text-[#595959]"
    >
      <span>{label}</span>
      {required && <span className="ml-1 text-[#59C7E8]">*</span>}
      {optionalText && <span className="ml-1 text-[#595959]">{optionalText}</span>}
    </label>
  );
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");
  const generalSectionRef = useRef<HTMLDivElement>(null);
  const dealershipSectionRef = useRef<HTMLDivElement>(null);
  const oemSectionRef = useRef<HTMLDivElement>(null);
  const exportSectionRef = useRef<HTMLDivElement>(null);

  const selectCategory = (tab: ActiveTab) => {
    setActiveTab(tab);
    requestAnimationFrame(() => {
      const refMap = {
        general: generalSectionRef,
        dealership: dealershipSectionRef,
        oem: oemSectionRef,
        export: exportSectionRef,
      };
      refMap[tab].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "dealership-application" || hash === "dealership") {
        selectCategory("dealership");
      } else if (hash === "oem-solutions" || hash === "oem") {
        selectCategory("oem");
      } else if (hash === "global-export" || hash === "export") {
        selectCategory("export");
      } else if (hash === "general-enquiry") {
        selectCategory("general");
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  // 1. General Enquiry State
  const [generalForm, setGeneralForm] = useState({
    fullName: "",
    businessEmail: "",
    phone: "",
    company: "",
    enquiryType: "",
    productCategory: "",
    message: "",
    consent: false,
  });
  const [generalFiles, setGeneralFiles] = useState<File[]>([]);
  const [generalDragActive, setGeneralDragActive] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [generalSubmitted, setGeneralSubmitted] = useState(false);
  const generalFileInputRef = useRef<HTMLInputElement>(null);

  // 2. Dealership Application State
  const [dealerForm, setDealerForm] = useState({
    firmName: "",
    contactPerson: "",
    businessEmail: "",
    phone: "",
    gstin: "",
    address: "",
    state: "",
    pinCode: "",
    experience: "",
    volumeTier: "",
    productLines: [] as string[],
    warehouseCapacity: "",
    certified: false,
  });
  const [dealerFiles, setDealerFiles] = useState<File[]>([]);
  const [dealerDragActive, setDealerDragActive] = useState(false);
  const [dealerError, setDealerError] = useState<string | null>(null);
  const [dealerSubmitted, setDealerSubmitted] = useState(false);
  const dealerFileInputRef = useRef<HTMLInputElement>(null);

  // 3. OEM Solutions & Engineering State
  const [oemForm, setOemForm] = useState({
    enterpriseBrand: "",
    engineeringLead: "",
    corporateEmail: "",
    directMobile: "",
    hostApplication: "",
    capacitorFamily: "",
    rating: "",
    ratedVoltage: "",
    annualVolume: "",
    certifications: ["BIS IS:2993 / 13340", "UL 810 (US Safety)"] as string[],
    drawingNotes: "",
    consent: false,
  });
  const [oemFiles, setOemFiles] = useState<File[]>([]);
  const [oemDragActive, setOemDragActive] = useState(false);
  const [oemError, setOemError] = useState<string | null>(null);
  const [oemSubmitted, setOemSubmitted] = useState(false);
  const oemFileInputRef = useRef<HTMLInputElement>(null);

  // 4. Global Footprint & Export State
  const [exportForm, setExportForm] = useState({
    importerFirm: "",
    procurementManager: "",
    officialEmail: "",
    internationalPhone: "",
    destinationCountry: "",
    portOfDischarge: "",
    incoterm: "CIF (Port of Discharge)",
    paymentInstrument: "Irrevocable LC at Sight",
    orderVolume: "",
    certifications: ["GSO / ESMA (GCC Standards)"] as string[],
    packagingNotes: "",
    consent: false,
  });
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSubmitted, setExportSubmitted] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleGeneralFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const combined = [...generalFiles, ...incoming].slice(0, 3);
    setGeneralFiles(combined);
  };

  const handleDealerFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    setDealerFiles(incoming.slice(0, 1));
  };

  const handleOemFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    setOemFiles(incoming.slice(0, 1));
  };

  const toggleDealerProductLine = (line: string) => {
    setDealerForm((prev) => ({
      ...prev,
      productLines: prev.productLines.includes(line)
        ? prev.productLines.filter((item) => item !== line)
        : [...prev.productLines, line],
    }));
  };

  const toggleOemCertification = (cert: string) => {
    setOemForm((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((item) => item !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const toggleExportCertification = (cert: string) => {
    setExportForm((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((item) => item !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleGeneralSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);

    if (
      !generalForm.fullName.trim() ||
      !generalForm.businessEmail.trim() ||
      !generalForm.phone.trim() ||
      !generalForm.enquiryType ||
      !generalForm.message.trim()
    ) {
      setGeneralError("Please fill out all required fields marked with *.");
      return;
    }

    if (!generalForm.consent) {
      setGeneralError("Please agree to the commercial communications and data protection policy.");
      return;
    }

    setGeneralSubmitted(true);
  };

  const handleDealerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDealerError(null);

    if (
      !dealerForm.firmName.trim() ||
      !dealerForm.contactPerson.trim() ||
      !dealerForm.businessEmail.trim() ||
      !dealerForm.phone.trim() ||
      !dealerForm.gstin.trim() ||
      !dealerForm.address.trim() ||
      !dealerForm.state ||
      !dealerForm.pinCode.trim() ||
      !dealerForm.experience ||
      !dealerForm.volumeTier
    ) {
      setDealerError("Please complete all required fields marked with *.");
      return;
    }

    if (!dealerForm.certified) {
      setDealerError("Please certify that all GST and distribution details provided are authentic.");
      return;
    }

    setDealerSubmitted(true);
  };

  const handleOemSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOemError(null);

    if (
      !oemForm.enterpriseBrand.trim() ||
      !oemForm.engineeringLead.trim() ||
      !oemForm.corporateEmail.trim() ||
      !oemForm.directMobile.trim() ||
      !oemForm.hostApplication ||
      !oemForm.capacitorFamily ||
      !oemForm.rating.trim() ||
      !oemForm.ratedVoltage ||
      !oemForm.annualVolume
    ) {
      setOemError("Please complete all required OEM engineering specification fields marked with *.");
      return;
    }

    if (!oemForm.consent) {
      setOemError("Please confirm engineering review acknowledgement for OEM mass production.");
      return;
    }

    setOemSubmitted(true);
  };

  const handleExportSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExportError(null);

    if (
      !exportForm.importerFirm.trim() ||
      !exportForm.procurementManager.trim() ||
      !exportForm.officialEmail.trim() ||
      !exportForm.internationalPhone.trim() ||
      !exportForm.destinationCountry ||
      !exportForm.portOfDischarge.trim() ||
      !exportForm.incoterm ||
      !exportForm.paymentInstrument ||
      !exportForm.orderVolume.trim()
    ) {
      setExportError("Please complete all required international export fields marked with *.");
      return;
    }

    if (!exportForm.consent) {
      setExportError("Please confirm agreement to international freight and proforma terms.");
      return;
    }

    setExportSubmitted(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#020202]">
      {/* Main Navigation */}
      <PublicNav
        variant="light"
        logoSrc="/figma/solutions/caef4.png"
        className="!border-b-0 bg-white/95"
      />

      {/* Hero Section */}
      <section className="px-6 pt-10 sm:pt-14 lg:px-[60px] lg:pt-[80px]">
        <div className="mx-auto max-w-[1800px]">
          <div className="flex flex-col items-start gap-6 sm:gap-9 lg:gap-[48px]">
            <div className="flex items-center gap-2">
              <span className="h-[6px] w-[6px] shrink-0 bg-[#58C7E8]" />
              <span className="text-[14px] font-medium uppercase leading-none text-[#020202] sm:text-[16px]">
                CONTACT
              </span>
            </div>
            <h1 className="max-w-[1458px] text-[38px] font-normal leading-[1.02] tracking-[-0.048em] text-[#020202] sm:text-[60px] md:text-[78px] xl:text-[104px] xl:leading-[1]">
              Engineering Support, Dealership Onboarding &amp; Global Supply
            </h1>
          </div>
          <div className="mt-10 h-px w-full bg-[#E4E4E4]/50 lg:mt-[78px]" />
        </div>
      </section>

      {/* Enquiry Categories & Forms Section */}
      <section id="contact" className="px-6 pb-20 pt-10 sm:pt-14 lg:px-[60px] lg:pb-[120px] lg:pt-[80px]">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-10 lg:gap-[62px]">
          {/* 1. General / Visitor Enquiry */}
          <div
            ref={generalSectionRef}
            id="general-enquiry"
            className="scroll-mt-28 flex flex-col items-start gap-8 xl:flex-row xl:items-start xl:gap-[42px]"
          >
            <button
              type="button"
              onClick={() => selectCategory("general")}
              aria-expanded={activeTab === "general"}
              className="group flex cursor-pointer flex-col items-start gap-2 text-left xl:w-[321px] xl:shrink-0"
            >
              <span
                className={`text-[22px] font-medium leading-[1.2] underline underline-offset-[5px] transition sm:text-[26px] lg:text-[28px] ${
                  activeTab === "general"
                    ? "text-[#58C7E8] decoration-[#58C7E8]"
                    : "text-[#020202] decoration-[#020202] group-hover:text-[#58C7E8] group-hover:decoration-[#58C7E8]"
                }`}
              >
                General / Visitor Enquiry
              </span>
              <span className="text-[16px] font-normal leading-[1.4] text-[#595959] sm:text-[18px]">
                Catalog requests &amp; tech queries
              </span>
            </button>

            {activeTab === "general" && (
              <>
                <div
                  aria-hidden="true"
                  className="hidden xl:flex xl:h-[43px] xl:w-[260px] xl:shrink-0 xl:items-center"
                >
                  <div className="h-[2px] w-full bg-[#F1F1F1]" />
                </div>

                <div
                  className="w-full bg-[#F4F4F4] p-5 sm:p-8 lg:p-[42px] xl:max-w-[1135px] xl:flex-1"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%)",
                  }}
                >
                  <div className="flex flex-col gap-7 lg:gap-[38px]">
                    {/* Form Header */}
                    <div className="flex flex-col items-start gap-5 lg:gap-[24px]">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-[18px]">
                        <span
                          className="inline-flex h-[35px] min-w-[115px] items-center justify-center bg-white px-3 text-[13px] font-normal leading-[1.4] text-[#020202] sm:text-[14px]"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                          }}
                        >
                          GET IN TOUCH
                        </span>
                        <span className="h-[26px] w-px bg-[#DBDBDB]" aria-hidden="true" />
                        <span className="text-[13px] font-medium leading-[1.2] text-[#595959] sm:text-[14px]">
                          REF: GEN-Q24
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h2 className="text-[22px] font-normal leading-[1.2] text-[#020202] sm:text-[26px]">
                          General Enquiry
                        </h2>
                        <p className="max-w-[1051px] text-[15px] font-normal leading-[1.4] text-[#595959] sm:text-[18px]">
                          Have a question about our capacitor lines, test compliance certificates, or
                          batch stock? Our commercial support engineering team responds within 24
                          hours.
                        </p>
                      </div>
                    </div>

                    {generalSubmitted ? (
                      <div className="border border-[#58C7E8] bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#58C7E8]">
                          <span className="h-2 w-2 bg-[#58C7E8]" />
                          Enquiry Logged • REF: GEN-Q24
                        </div>
                        <h3 className="mt-3 text-xl font-medium text-[#020202]">
                          Thank you, {generalForm.fullName}. Your technical enquiry has been received.
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#595959]">
                          Our commercial support engineering desk will review your parameters and
                          respond to <strong>{generalForm.businessEmail}</strong> within 24 working
                          hours.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setGeneralSubmitted(false);
                            setGeneralForm({
                              fullName: "",
                              businessEmail: "",
                              phone: "",
                              company: "",
                              enquiryType: "",
                              productCategory: "",
                              message: "",
                              consent: false,
                            });
                            setGeneralFiles([]);
                          }}
                          className="mt-6 inline-flex h-[36px] items-center gap-3 bg-[#58C7E8] px-4 text-[14px] font-medium text-[#020202] transition hover:bg-[#42b8db]"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                          }}
                        >
                          Submit Another Enquiry
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleGeneralSubmit} noValidate className="flex flex-col gap-5">
                        {/* Row 1: Full Name & Business Email */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor="gen-full-name" label="Full Name" required />
                            <input
                              id="gen-full-name"
                              type="text"
                              required
                              placeholder="e.g. Ramesh Patel"
                              value={generalForm.fullName}
                              onChange={(e) =>
                                setGeneralForm((prev) => ({ ...prev, fullName: e.target.value }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor="gen-business-email" label="Business Email" required />
                            <input
                              id="gen-business-email"
                              type="email"
                              required
                              placeholder="r.patel@company.com"
                              value={generalForm.businessEmail}
                              onChange={(e) =>
                                setGeneralForm((prev) => ({
                                  ...prev,
                                  businessEmail: e.target.value,
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>
                        </div>

                        {/* Row 2: Phone Number & Company / Organization */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor="gen-phone" label="Phone Number" required />
                            <div className="flex h-[46px] w-full items-center gap-2 border border-[#E4E4E4] bg-white px-[14px] focus-within:border-[#58C7E8]">
                              <span className="shrink-0 text-[15px] font-bold leading-[1.4] text-[#020202] sm:text-[16px]">
                                +91
                              </span>
                              <input
                                id="gen-phone"
                                type="tel"
                                required
                                placeholder="9876543210"
                                value={generalForm.phone}
                                onChange={(e) =>
                                  setGeneralForm((prev) => ({ ...prev, phone: e.target.value }))
                                }
                                className="h-full w-full bg-transparent text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:outline-none sm:text-[16px]"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor="gen-company" label="Company / Organization" />
                            <input
                              id="gen-company"
                              type="text"
                              placeholder="e.g. Apex Electricals Ltd"
                              value={generalForm.company}
                              onChange={(e) =>
                                setGeneralForm((prev) => ({ ...prev, company: e.target.value }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>
                        </div>

                        {/* Row 3: Enquiry Type & Product Category Interest */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor="gen-enquiry-type" label="Enquiry Type" required />
                            <div className="relative">
                              <select
                                id="gen-enquiry-type"
                                required
                                value={generalForm.enquiryType}
                                onChange={(e) =>
                                  setGeneralForm((prev) => ({
                                    ...prev,
                                    enquiryType: e.target.value,
                                  }))
                                }
                                className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                  generalForm.enquiryType ? "text-[#020202]" : "text-[#595959]/50"
                                }`}
                              >
                                <option value="">Select Enquiry Classification</option>
                                {ENQUIRY_TYPES.map((option) => (
                                  <option key={option} value={option} className="text-[#020202]">
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                <ChevronDownIcon />
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="gen-product-category"
                              label="Product Category Interest"
                            />
                            <div className="relative">
                              <select
                                id="gen-product-category"
                                value={generalForm.productCategory}
                                onChange={(e) =>
                                  setGeneralForm((prev) => ({
                                    ...prev,
                                    productCategory: e.target.value,
                                  }))
                                }
                                className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                  generalForm.productCategory ? "text-[#020202]" : "text-[#595959]/50"
                                }`}
                              >
                                <option value="">Select Primary Product Family</option>
                                {PRODUCT_FAMILIES.map((option) => (
                                  <option key={option} value={option} className="text-[#020202]">
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                <ChevronDownIcon />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Row 4: Detailed Message / Electrical Parameters */}
                        <div className="flex flex-col gap-2">
                          <FieldLabel
                            htmlFor="gen-message"
                            label="Detailed Message / Electrical Parameters"
                            required
                          />
                          <textarea
                            id="gen-message"
                            required
                            rows={4}
                            placeholder="e.g. Ramesh Patel"
                            value={generalForm.message}
                            onChange={(e) =>
                              setGeneralForm((prev) => ({ ...prev, message: e.target.value }))
                            }
                            className="h-[114px] w-full resize-y border border-[#E4E4E4] bg-white p-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                          />
                        </div>

                        {/* Row 5: Attach Technical Specifications / BOM (Optional) */}
                        <div className="flex flex-col gap-2">
                          <FieldLabel
                            label="Attach Technical Specifications / BOM"
                            optionalText="(Optional)"
                          />
                          <input
                            ref={generalFileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.dwg,.step,.stp,.xlsx,.xls,.docx,.doc"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleGeneralFiles(e.target.files)
                            }
                            className="sr-only"
                          />
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => generalFileInputRef.current?.click()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                generalFileInputRef.current?.click();
                              }
                            }}
                            onDragOver={(e: DragEvent<HTMLDivElement>) => {
                              e.preventDefault();
                              setGeneralDragActive(true);
                            }}
                            onDragLeave={() => setGeneralDragActive(false)}
                            onDrop={(e: DragEvent<HTMLDivElement>) => {
                              e.preventDefault();
                              setGeneralDragActive(false);
                              handleGeneralFiles(e.dataTransfer.files);
                            }}
                            className={`flex min-h-[121px] w-full cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-4 py-6 text-center transition ${
                              generalDragActive
                                ? "border-[#58C7E8] bg-[#58C7E8]/5"
                                : "border-[#DBDBDB] bg-white hover:border-[#58C7E8]"
                            }`}
                          >
                            <FileUploadIcon />
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[14px] font-medium leading-[1.2] text-[#020202]">
                                Click to browse or drop engineering drawings
                              </span>
                              <span className="text-[12px] font-normal leading-[1.2] text-[#595959]">
                                Accepts PDF, DWG, STEP, XLSX, DOCX (Max 3 files, 5MB each)
                              </span>
                            </div>
                          </div>

                          {generalFiles.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {generalFiles.map((file, idx) => (
                                <span
                                  key={`${file.name}-${idx}`}
                                  className="inline-flex items-center gap-2 border border-[#E4E4E4] bg-white px-3 py-1 text-xs text-[#020202]"
                                >
                                  <span className="max-w-[220px] truncate">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setGeneralFiles((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    aria-label={`Remove ${file.name}`}
                                    className="font-bold text-[#595959] hover:text-[#020202]"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Row 6: Consent Checkbox */}
                        <label className="flex cursor-pointer items-start gap-2.5 select-none">
                          <input
                            type="checkbox"
                            checked={generalForm.consent}
                            onChange={(e) =>
                              setGeneralForm((prev) => ({ ...prev, consent: e.target.checked }))
                            }
                            className="mt-0.5 h-[16px] w-[16px] shrink-0 rounded-[2px] border border-[#E4E4E4] bg-white accent-[#58C7E8]"
                          />
                          <span className="text-[13px] font-normal leading-[1.3] text-[#595959] sm:text-[14px]">
                            I agree to receive commercial communications and technical responses
                            from CAPCO Capacitors (Dada Energies Pvt. Ltd.). I understand data is
                            handled under ISO-grade data protection policies.
                          </span>
                        </label>

                        {generalError && (
                          <p role="alert" className="text-sm font-medium text-red-600">
                            {generalError}
                          </p>
                        )}

                        {/* Divider Line */}
                        <div className="h-px w-full bg-[#DBDBDB]" />

                        {/* Submit Row */}
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                          <button
                            type="submit"
                            className="inline-flex h-[36px] min-w-[231px] items-center justify-between gap-4 whitespace-nowrap bg-[#58C7E8] px-3 text-[14px] font-medium leading-[1.2] text-[#020202] transition hover:bg-[#43b8da]"
                            style={{
                              clipPath:
                                "polygon(0 0, 100% 0, 100% calc(100% - 9.4px), calc(100% - 9px) 100%, 0 100%)",
                            }}
                          >
                            <span>Submit Technical Enquiry</span>
                            <SendPlaneIcon />
                          </button>

                          <div className="flex items-center gap-2">
                            <ClockIcon />
                            <span className="text-[13px] font-normal leading-[1.2] text-[#595959] sm:text-[14px]">
                              Guaranteed Technical Response &lt; 24 Working Hours
                            </span>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-px w-full bg-[#E4E4E4]/50" />

          {/* 2. Dealership Application */}
          <div
            ref={dealershipSectionRef}
            id="dealership-application"
            className="scroll-mt-28 flex flex-col items-start gap-8 xl:flex-row xl:items-start xl:gap-[42px]"
          >
            <button
              type="button"
              onClick={() => selectCategory("dealership")}
              aria-expanded={activeTab === "dealership"}
              className="group flex cursor-pointer flex-col items-start gap-2 text-left xl:w-[321px] xl:shrink-0"
            >
              <span
                className={`text-[22px] font-medium leading-[1.2] underline underline-offset-[5px] transition sm:text-[26px] lg:text-[28px] ${
                  activeTab === "dealership"
                    ? "text-[#58C7E8] decoration-[#58C7E8]"
                    : "text-[#020202] decoration-[#020202] group-hover:text-[#58C7E8] group-hover:decoration-[#58C7E8]"
                }`}
              >
                Dealership Application
              </span>
              <span className="text-[16px] font-normal leading-[1.4] text-[#595959] sm:text-[18px]">
                Authorized channel onboarding
              </span>
            </button>

            {activeTab === "dealership" && (
              <>
                <div
                  aria-hidden="true"
                  className="hidden xl:flex xl:h-[43px] xl:w-[260px] xl:shrink-0 xl:items-center"
                >
                  <div className="h-[2px] w-full bg-[#F1F1F1]" />
                </div>

                <div
                  className="w-full bg-[#F4F4F4] p-5 sm:p-8 lg:p-[42px] xl:max-w-[1135px] xl:flex-1"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%)",
                  }}
                >
                  <div className="flex flex-col gap-7 lg:gap-[38px]">
                    {/* Form Header */}
                    <div className="flex flex-col items-start gap-5 lg:gap-[24px]">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-[18px]">
                        <span
                          className="inline-flex h-[35px] min-w-[205px] items-center justify-center bg-white px-3 text-[13px] font-semibold leading-[1.4] text-[#020202] sm:text-[14px]"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                          }}
                        >
                          BECOME A CAPCO DEALER
                        </span>
                        <span className="h-[26px] w-px bg-[#DBDBDB]" aria-hidden="true" />
                        <span className="text-[13px] font-medium leading-[1.2] text-[#595959] sm:text-[14px]">
                          REF: DLR-REG-IND
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h2 className="text-[22px] font-normal leading-[1.2] text-[#020202] sm:text-[26px]">
                          Dealership &amp; Distribution Onboarding
                        </h2>
                        <p className="max-w-[1051px] text-[15px] font-normal leading-[1.4] text-[#595959] sm:text-[18px]">
                          Join 500+ authorized dealers across India. Fill out this registration
                          module to start your dealership review. Our channel sales executive will
                          initiate evaluation within 3 working days.
                        </p>
                      </div>
                    </div>

                    {dealerSubmitted ? (
                      <div className="border border-[#58C7E8] bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#58C7E8]">
                          <span className="h-2 w-2 bg-[#58C7E8]" />
                          Application Logged • REF: DLR-REG-IND
                        </div>
                        <h3 className="mt-3 text-xl font-medium text-[#020202]">
                          Dealership onboarding application received for {dealerForm.firmName}.
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#595959]">
                          Our channel sales executive will review your GSTIN (
                          <strong>{dealerForm.gstin}</strong>) and territory details and contact{" "}
                          <strong>{dealerForm.contactPerson}</strong> within 3 working days.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setDealerSubmitted(false);
                            setDealerForm({
                              firmName: "",
                              contactPerson: "",
                              businessEmail: "",
                              phone: "",
                              gstin: "",
                              address: "",
                              state: "",
                              pinCode: "",
                              experience: "",
                              volumeTier: "",
                              productLines: [],
                              warehouseCapacity: "",
                              certified: false,
                            });
                            setDealerFiles([]);
                          }}
                          className="mt-6 inline-flex h-[36px] items-center gap-3 bg-[#58C7E8] px-4 text-[14px] font-medium text-[#020202] transition hover:bg-[#42b8db]"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                          }}
                        >
                          Submit Another Application
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleDealerSubmit} noValidate className="flex flex-col gap-5">
                        {/* Section 1: BUSINESS PROFILE & CONTACT LEAD */}
                        <div className="flex flex-col gap-5 bg-[#D8F1F9] p-4 sm:p-[20px]">
                          <h3 className="text-[14px] font-medium uppercase leading-[1.2] text-[#020202]">
                            1. BUSINESS PROFILE &amp; CONTACT LEAD
                          </h3>

                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="dlr-firm-name"
                                label="Firm / Enterprise Name"
                                required
                              />
                              <input
                                id="dlr-firm-name"
                                type="text"
                                required
                                placeholder="e.g. Swastik Electric Agency"
                                value={dealerForm.firmName}
                                onChange={(e) =>
                                  setDealerForm((prev) => ({ ...prev, firmName: e.target.value }))
                                }
                                className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="dlr-contact-person"
                                label="Authorized Contact Person"
                                required
                              />
                              <input
                                id="dlr-contact-person"
                                type="text"
                                required
                                placeholder="e.g. Anil Kumar Agrawal"
                                value={dealerForm.contactPerson}
                                onChange={(e) =>
                                  setDealerForm((prev) => ({
                                    ...prev,
                                    contactPerson: e.target.value,
                                  }))
                                }
                                className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="dlr-business-email"
                                label="Business Email"
                                required
                              />
                              <input
                                id="dlr-business-email"
                                type="email"
                                required
                                placeholder="contact@swastikelectric.com"
                                value={dealerForm.businessEmail}
                                onChange={(e) =>
                                  setDealerForm((prev) => ({
                                    ...prev,
                                    businessEmail: e.target.value,
                                  }))
                                }
                                className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel htmlFor="dlr-phone" label="Phone Number" required />
                              <div className="flex h-[46px] w-full items-center gap-2 border border-[#E4E4E4] bg-white px-[14px] focus-within:border-[#58C7E8]">
                                <span className="shrink-0 text-[15px] font-bold leading-[1.4] text-[#020202] sm:text-[16px]">
                                  +91
                                </span>
                                <input
                                  id="dlr-phone"
                                  type="tel"
                                  required
                                  placeholder="9876543210"
                                  value={dealerForm.phone}
                                  onChange={(e) =>
                                    setDealerForm((prev) => ({ ...prev, phone: e.target.value }))
                                  }
                                  className="h-full w-full bg-transparent text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:outline-none sm:text-[16px]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: STATUTORY & GEOGRAPHICAL FOOTPRINT */}
                        <div className="flex flex-col gap-5 bg-[#D8F1F9] p-4 sm:p-[20px]">
                          <h3 className="text-[14px] font-medium uppercase leading-[1.2] text-[#020202]">
                            2. STATUTORY &amp; GEOGRAPHICAL FOOTPRINT
                          </h3>

                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="dlr-gstin"
                              label="GSTIN Number (15 Digits)"
                              required
                            />
                            <input
                              id="dlr-gstin"
                              type="text"
                              required
                              maxLength={15}
                              placeholder="36AAAAA0000A1Z5"
                              value={dealerForm.gstin}
                              onChange={(e) =>
                                setDealerForm((prev) => ({
                                  ...prev,
                                  gstin: e.target.value.toUpperCase(),
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                            <span className="text-[12px] font-normal leading-[1.2] text-[#595959]">
                              Verified against Indian Goods &amp; Services Tax Network database
                            </span>
                          </div>

                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="dlr-address"
                              label="Registered Warehouse / Shop Address"
                              required
                            />
                            <input
                              id="dlr-address"
                              type="text"
                              required
                              placeholder="Plot / Door No, Street, Commercial Complex"
                              value={dealerForm.address}
                              onChange={(e) =>
                                setDealerForm((prev) => ({ ...prev, address: e.target.value }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="dlr-state"
                                label="State / Union Territory"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="dlr-state"
                                  required
                                  value={dealerForm.state}
                                  onChange={(e) =>
                                    setDealerForm((prev) => ({ ...prev, state: e.target.value }))
                                  }
                                  className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                    dealerForm.state ? "text-[#020202]" : "text-[#595959]/50"
                                  }`}
                                >
                                  <option value="">Select State</option>
                                  {INDIAN_STATES.map((stateName) => (
                                    <option
                                      key={stateName}
                                      value={stateName}
                                      className="text-[#020202]"
                                    >
                                      {stateName}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel htmlFor="dlr-pincode" label="PIN Code" required />
                              <input
                                id="dlr-pincode"
                                type="text"
                                required
                                maxLength={6}
                                placeholder="500003"
                                value={dealerForm.pinCode}
                                onChange={(e) =>
                                  setDealerForm((prev) => ({ ...prev, pinCode: e.target.value }))
                                }
                                className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 3: DISTRIBUTION CAPACITY & EXPERIENCE */}
                        <div className="flex flex-col gap-5 bg-[#D8F1F9] p-4 sm:p-[20px]">
                          <h3 className="text-[14px] font-medium uppercase leading-[1.2] text-[#020202]">
                            3. DISTRIBUTION CAPACITY &amp; EXPERIENCE
                          </h3>

                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="dlr-experience"
                                label="Years in Electrical Distribution"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="dlr-experience"
                                  required
                                  value={dealerForm.experience}
                                  onChange={(e) =>
                                    setDealerForm((prev) => ({
                                      ...prev,
                                      experience: e.target.value,
                                    }))
                                  }
                                  className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                    dealerForm.experience ? "text-[#020202]" : "text-[#595959]/50"
                                  }`}
                                >
                                  <option value="">Select Experience</option>
                                  {EXPERIENCE_TIERS.map((tier) => (
                                    <option key={tier} value={tier} className="text-[#020202]">
                                      {tier}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="dlr-volume-tier"
                                label="Target Annual Purchase Tier"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="dlr-volume-tier"
                                  required
                                  value={dealerForm.volumeTier}
                                  onChange={(e) =>
                                    setDealerForm((prev) => ({
                                      ...prev,
                                      volumeTier: e.target.value,
                                    }))
                                  }
                                  className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                    dealerForm.volumeTier ? "text-[#020202]" : "text-[#595959]/50"
                                  }`}
                                >
                                  <option value="">Select Volume Tier</option>
                                  {VOLUME_TIERS.map((tier) => (
                                    <option key={tier} value={tier} className="text-[#020202]">
                                      {tier}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Current Product Lines Handled */}
                          <div className="flex flex-col gap-2">
                            <FieldLabel label="Current Product Lines Handled" />
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {PRODUCT_LINES_HANDLED.map((line) => {
                                const checked = dealerForm.productLines.includes(line);
                                return (
                                  <label
                                    key={line}
                                    className={`flex h-[39px] cursor-pointer items-center gap-2 border px-[14px] transition select-none ${
                                      checked
                                        ? "border-[#58C7E8] bg-white"
                                        : "border-[#E4E4E4] bg-white hover:border-[#58C7E8]"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleDealerProductLine(line)}
                                      className="h-[16px] w-[16px] shrink-0 rounded-[2px] border border-[#E4E4E4] bg-white accent-[#58C7E8]"
                                    />
                                    <span className="text-[14px] font-normal leading-[1.4] text-[#595959]">
                                      {line}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Covered Warehouse Capacity */}
                          <div className="flex flex-col gap-2">
                            <FieldLabel label="Covered Warehouse Capacity" />
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                              {WAREHOUSE_CAPACITIES.map((cap) => {
                                const selected = dealerForm.warehouseCapacity === cap;
                                return (
                                  <label
                                    key={cap}
                                    className={`flex h-[39px] cursor-pointer items-center gap-2 border px-[14px] transition select-none ${
                                      selected
                                        ? "border-[#58C7E8] bg-white"
                                        : "border-[#E4E4E4] bg-white hover:border-[#58C7E8]"
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name="warehouseCapacity"
                                      checked={selected}
                                      onChange={() =>
                                        setDealerForm((prev) => ({
                                          ...prev,
                                          warehouseCapacity: cap,
                                        }))
                                      }
                                      className="h-[16px] w-[16px] shrink-0 border border-[#E4E4E4] bg-white accent-[#58C7E8]"
                                    />
                                    <span className="text-[14px] font-normal leading-[1.4] text-[#595959]">
                                      {cap}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* KYC Documents Upload */}
                        <div className="flex flex-col gap-2">
                          <FieldLabel
                            label="KYC Documents (GST Certificate, Trade License)"
                            required
                          />
                          <input
                            ref={dealerFileInputRef}
                            type="file"
                            accept=".pdf,.zip,.rar,.jpg,.jpeg,.png"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleDealerFiles(e.target.files)
                            }
                            className="sr-only"
                          />
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => dealerFileInputRef.current?.click()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                dealerFileInputRef.current?.click();
                              }
                            }}
                            onDragOver={(e: DragEvent<HTMLDivElement>) => {
                              e.preventDefault();
                              setDealerDragActive(true);
                            }}
                            onDragLeave={() => setDealerDragActive(false)}
                            onDrop={(e: DragEvent<HTMLDivElement>) => {
                              e.preventDefault();
                              setDealerDragActive(false);
                              handleDealerFiles(e.dataTransfer.files);
                            }}
                            className={`flex min-h-[121px] w-full cursor-pointer flex-col items-center justify-center gap-3 border border-dashed px-4 py-6 text-center transition ${
                              dealerDragActive
                                ? "border-[#58C7E8] bg-[#58C7E8]/5"
                                : "border-[#DBDBDB] bg-white hover:border-[#58C7E8]"
                            }`}
                          >
                            <FileUploadIcon />
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[14px] font-medium leading-[1.2] text-[#020202]">
                                Upload Statutory Pack
                              </span>
                              <span className="text-[12px] font-normal leading-[1.2] text-[#595959]">
                                PDF/ZIP up to 10MB
                              </span>
                            </div>
                          </div>

                          {dealerFiles.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {dealerFiles.map((file, idx) => (
                                <span
                                  key={`${file.name}-${idx}`}
                                  className="inline-flex items-center gap-2 border border-[#E4E4E4] bg-white px-3 py-1 text-xs text-[#020202]"
                                >
                                  <span className="max-w-[260px] truncate">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDealerFiles((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    aria-label={`Remove ${file.name}`}
                                    className="font-bold text-[#595959] hover:text-[#020202]"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Certification Checkbox */}
                        <label className="flex cursor-pointer items-start gap-2.5 select-none">
                          <input
                            type="checkbox"
                            checked={dealerForm.certified}
                            onChange={(e) =>
                              setDealerForm((prev) => ({ ...prev, certified: e.target.checked }))
                            }
                            className="mt-0.5 h-[16px] w-[16px] shrink-0 rounded-[2px] border border-[#E4E4E4] bg-white accent-[#58C7E8]"
                          />
                          <span className="text-[13px] font-normal leading-[1.3] text-[#595959] sm:text-[14px]">
                            I certify that all GST and distribution details provided are authentic.
                            I agree to receive terms for territory allotment from Dada Energies Pvt.
                            Ltd.
                          </span>
                        </label>

                        {dealerError && (
                          <p role="alert" className="text-sm font-medium text-red-600">
                            {dealerError}
                          </p>
                        )}

                        {/* Divider Line */}
                        <div className="h-px w-full bg-[#DBDBDB]" />

                        {/* Submit Button */}
                        <div>
                          <button
                            type="submit"
                            className="inline-flex h-[36px] min-w-[247px] max-w-full items-center justify-between gap-4 whitespace-nowrap bg-[#58C7E8] px-3 text-[14px] font-medium leading-[1.2] text-[#020202] transition hover:bg-[#43b8da]"
                            style={{
                              clipPath:
                                "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                            }}
                          >
                            <span>Submit Dealership Application</span>
                            <SendPlaneIcon />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-px w-full bg-[#E4E4E4]/50" />

          {/* 3. OEM Solutions & Engineering */}
          <div
            ref={oemSectionRef}
            id="oem-solutions"
            className="scroll-mt-28 flex flex-col items-start gap-8 xl:flex-row xl:items-start xl:gap-[42px]"
          >
            <button
              type="button"
              onClick={() => selectCategory("oem")}
              aria-expanded={activeTab === "oem"}
              className="group flex cursor-pointer flex-col items-start gap-2 text-left xl:w-[382px] xl:shrink-0"
            >
              <span
                className={`text-[22px] font-medium leading-[1.2] underline underline-offset-[5px] transition sm:text-[26px] lg:text-[28px] xl:whitespace-nowrap ${
                  activeTab === "oem"
                    ? "text-[#58C7E8] decoration-[#58C7E8]"
                    : "text-[#020202] decoration-[#020202] group-hover:text-[#58C7E8] group-hover:decoration-[#58C7E8]"
                }`}
              >
                OEM Solutions &amp; Engineering
              </span>
              <span className="text-[16px] font-normal leading-[1.4] text-[#595959] sm:text-[18px]">
                Custom capacitance &amp; CAD designs
              </span>
            </button>

            {activeTab === "oem" && (
              <>
                <div
                  aria-hidden="true"
                  className="hidden xl:flex xl:h-[43px] xl:w-[199px] xl:shrink-0 xl:items-center"
                >
                  <div className="h-[2px] w-full bg-[#F1F1F1]" />
                </div>

                <div
                  className="w-full bg-[#F4F4F4] p-5 sm:p-8 lg:p-[42px] xl:max-w-[1135px] xl:flex-1"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%)",
                  }}
                >
                  <div className="flex flex-col gap-7 lg:gap-[38px]">
                    {/* Form Header */}
                    <div className="flex flex-col items-start gap-5 lg:gap-[24px]">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-[18px]">
                        <span
                          className="inline-flex h-[35px] min-w-[175px] items-center justify-center bg-white px-3 text-[13px] font-semibold leading-[1.4] text-[#020202] sm:text-[14px]"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                          }}
                        >
                          OEM CUSTOM BUILDS
                        </span>
                        <span className="h-[26px] w-px bg-[#DBDBDB]" aria-hidden="true" />
                        <span className="text-[13px] font-medium leading-[1.2] text-[#595959] sm:text-[14px]">
                          REF: OEM-SPEC-ENGINE
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h2 className="text-[22px] font-normal leading-[1.2] text-[#020202] sm:text-[26px]">
                          Request OEM Pricing / Custom Solution
                        </h2>
                        <p className="max-w-[1051px] text-[15px] font-normal leading-[1.4] text-[#595959] sm:text-[18px]">
                          Direct conduit to CAPCO&apos;s research engineers. Specify your capacitor
                          tolerances, mechanical form factors, and safety interlocks for customized
                          OEM batches.
                        </p>
                      </div>
                    </div>

                    {oemSubmitted ? (
                      <div className="border border-[#58C7E8] bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#58C7E8]">
                          <span className="h-2 w-2 bg-[#58C7E8]" />
                          OEM RFQ Logged • REF: OEM-SPEC-ENGINE
                        </div>
                        <h3 className="mt-3 text-xl font-medium text-[#020202]">
                          Custom OEM quotation request received for {oemForm.enterpriseBrand}.
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#595959]">
                          Our R&amp;D and OEM application engineering desk will evaluate your{" "}
                          <strong>{oemForm.rating}</strong> ({oemForm.ratedVoltage}) specification
                          and contact <strong>{oemForm.engineeringLead}</strong> at{" "}
                          <strong>{oemForm.corporateEmail}</strong>.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setOemSubmitted(false);
                            setOemForm({
                              enterpriseBrand: "",
                              engineeringLead: "",
                              corporateEmail: "",
                              directMobile: "",
                              hostApplication: "",
                              capacitorFamily: "",
                              rating: "",
                              ratedVoltage: "",
                              annualVolume: "",
                              certifications: ["BIS IS:2993 / 13340", "UL 810 (US Safety)"],
                              drawingNotes: "",
                              consent: false,
                            });
                            setOemFiles([]);
                          }}
                          className="mt-6 inline-flex h-[36px] items-center gap-3 bg-[#58C7E8] px-4 text-[14px] font-medium text-[#020202] transition hover:bg-[#42b8db]"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                          }}
                        >
                          Submit Another OEM RFQ
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleOemSubmit} noValidate className="flex flex-col gap-5">
                        {/* Row 1: OEM Enterprise / Brand & Engineering Lead / Procurement Head */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="oem-enterprise"
                              label="OEM Enterprise / Brand"
                              required
                            />
                            <input
                              id="oem-enterprise"
                              type="text"
                              required
                              placeholder="e.g. Havells / Crompton / Voltas Tier-1"
                              value={oemForm.enterpriseBrand}
                              onChange={(e) =>
                                setOemForm((prev) => ({
                                  ...prev,
                                  enterpriseBrand: e.target.value,
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="oem-lead"
                              label="Engineering Lead / Procurement Head"
                              required
                            />
                            <input
                              id="oem-lead"
                              type="text"
                              required
                              placeholder="e.g. Dr. S. N. Murthy"
                              value={oemForm.engineeringLead}
                              onChange={(e) =>
                                setOemForm((prev) => ({
                                  ...prev,
                                  engineeringLead: e.target.value,
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>
                        </div>

                        {/* Row 2: Corporate Engineering Email & Direct Desk / Mobile */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="oem-email"
                              label="Corporate Engineering Email"
                              required
                            />
                            <input
                              id="oem-email"
                              type="email"
                              required
                              placeholder="murthy@oemmanufacturer.com"
                              value={oemForm.corporateEmail}
                              onChange={(e) =>
                                setOemForm((prev) => ({
                                  ...prev,
                                  corporateEmail: e.target.value,
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="oem-mobile"
                              label="Direct Desk / Mobile"
                              required
                            />
                            <div className="flex h-[46px] w-full items-center gap-2 border border-[#E4E4E4] bg-white px-[14px] focus-within:border-[#58C7E8]">
                              <span className="shrink-0 text-[15px] font-bold leading-[1.4] text-[#020202] sm:text-[16px]">
                                +91
                              </span>
                              <input
                                id="oem-mobile"
                                type="tel"
                                required
                                placeholder="99000 XXXXX"
                                value={oemForm.directMobile}
                                onChange={(e) =>
                                  setOemForm((prev) => ({
                                    ...prev,
                                    directMobile: e.target.value,
                                  }))
                                }
                                className="h-full w-full bg-transparent text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:outline-none sm:text-[16px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Highlighted Section: ELECTRICAL & PHYSICAL SPECIFICATIONS */}
                        <div className="flex flex-col gap-5 bg-[#D8F1F9] p-4 sm:p-[20px]">
                          <h3 className="text-[14px] font-medium uppercase leading-[1.2] text-[#020202]">
                            ELECTRICAL &amp; PHYSICAL SPECIFICATIONS
                          </h3>

                          {/* Host Application & Required Capacitor Family */}
                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="oem-host-app"
                                label="Host Application / Apparatus"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="oem-host-app"
                                  required
                                  value={oemForm.hostApplication}
                                  onChange={(e) =>
                                    setOemForm((prev) => ({
                                      ...prev,
                                      hostApplication: e.target.value,
                                    }))
                                  }
                                  className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                    oemForm.hostApplication
                                      ? "text-[#020202]"
                                      : "text-[#595959]/50"
                                  }`}
                                >
                                  <option value="">Select Host System</option>
                                  {OEM_HOST_SYSTEMS.map((item) => (
                                    <option key={item} value={item} className="text-[#020202]">
                                      {item}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="oem-cap-family"
                                label="Required Capacitor Family"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="oem-cap-family"
                                  required
                                  value={oemForm.capacitorFamily}
                                  onChange={(e) =>
                                    setOemForm((prev) => ({
                                      ...prev,
                                      capacitorFamily: e.target.value,
                                    }))
                                  }
                                  className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                    oemForm.capacitorFamily
                                      ? "text-[#020202]"
                                      : "text-[#595959]/50"
                                  }`}
                                >
                                  <option value="">Select Specific Family</option>
                                  {OEM_CAPACITOR_FAMILIES.map((item) => (
                                    <option key={item} value={item} className="text-[#020202]">
                                      {item}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Rating, Rated AC Voltage, Annual OEM Run Volume */}
                          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="oem-rating"
                                label="Rating (MFD / KVAR)"
                                required
                              />
                              <input
                                id="oem-rating"
                                type="text"
                                required
                                placeholder="e.g. 36 MFD or 15 KVAR"
                                value={oemForm.rating}
                                onChange={(e) =>
                                  setOemForm((prev) => ({ ...prev, rating: e.target.value }))
                                }
                                className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                              />
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="oem-voltage"
                                label="Rated AC Voltage"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="oem-voltage"
                                  required
                                  value={oemForm.ratedVoltage}
                                  onChange={(e) =>
                                    setOemForm((prev) => ({
                                      ...prev,
                                      ratedVoltage: e.target.value,
                                    }))
                                  }
                                  className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                    oemForm.ratedVoltage ? "text-[#020202]" : "text-[#595959]/50"
                                  }`}
                                >
                                  <option value="">Select Voltage</option>
                                  {OEM_VOLTAGES.map((v) => (
                                    <option key={v} value={v} className="text-[#020202]">
                                      {v}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="oem-volume"
                                label="Annual OEM Run Volume"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="oem-volume"
                                  required
                                  value={oemForm.annualVolume}
                                  onChange={(e) =>
                                    setOemForm((prev) => ({
                                      ...prev,
                                      annualVolume: e.target.value,
                                    }))
                                  }
                                  className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                    oemForm.annualVolume ? "text-[#020202]" : "text-[#595959]/50"
                                  }`}
                                >
                                  <option value="">Select Batch Size</option>
                                  {OEM_BATCH_SIZES.map((batch) => (
                                    <option key={batch} value={batch} className="text-[#020202]">
                                      {batch}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Target Standard Certification Marks Required */}
                          <div className="flex flex-col gap-2">
                            <FieldLabel label="Target Standard Certification Marks Required" />
                            <div className="flex flex-wrap gap-3">
                              {OEM_CERTIFICATIONS.map((cert) => {
                                const checked = oemForm.certifications.includes(cert);
                                return (
                                  <label
                                    key={cert}
                                    className={`flex h-[39px] cursor-pointer items-center gap-2.5 border px-[14px] transition select-none ${
                                      checked
                                        ? "border-[#58C7E8] bg-white"
                                        : "border-[#E4E4E4] bg-white hover:border-[#58C7E8]"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleOemCertification(cert)}
                                      className="h-[16px] w-[16px] shrink-0 rounded-[2px] border border-[#E4E4E4] bg-white accent-[#58C7E8]"
                                    />
                                    <span className="text-[13px] font-medium leading-[1.4] text-[#020202] sm:text-[14px]">
                                      {cert}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Terminal Style, Potting Compound or Mechanical Drawing Notes */}
                        <div className="flex flex-col gap-2">
                          <FieldLabel
                            htmlFor="oem-drawing-notes"
                            label="Terminal Style, Potting Compound or Mechanical Drawing Notes"
                          />
                          <textarea
                            id="oem-drawing-notes"
                            rows={4}
                            placeholder="Specify push-on tag pins, wire leads (length & cross section), polyurethane/resin potting preference, can diameter or burst-proof safety mechanism..."
                            value={oemForm.drawingNotes}
                            onChange={(e) =>
                              setOemForm((prev) => ({ ...prev, drawingNotes: e.target.value }))
                            }
                            className="h-[104px] w-full resize-y border border-[#E4E4E4] bg-white p-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                          />
                        </div>

                        {/* Upload 2D/3D CAD Drawing / BOM Sheet */}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <FieldLabel label="Upload 2D/3D CAD Drawing / BOM Sheet" />
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-[0.02em] text-[#020202]">
                              <LockShieldIcon />
                              <span>Mutual NDA Protected</span>
                            </span>
                          </div>

                          <input
                            ref={oemFileInputRef}
                            type="file"
                            accept=".pdf,.dwg,.dxf,.step,.stp,.iges,.igs,.zip"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              handleOemFiles(e.target.files)
                            }
                            className="sr-only"
                          />

                          <div
                            onDragOver={(e: DragEvent<HTMLDivElement>) => {
                              e.preventDefault();
                              setOemDragActive(true);
                            }}
                            onDragLeave={() => setOemDragActive(false)}
                            onDrop={(e: DragEvent<HTMLDivElement>) => {
                              e.preventDefault();
                              setOemDragActive(false);
                              handleOemFiles(e.dataTransfer.files);
                            }}
                            className={`flex flex-col items-start justify-between gap-4 border px-4 py-4 transition sm:flex-row sm:items-center sm:px-5 ${
                              oemDragActive
                                ? "border-[#58C7E8] bg-[#D8F1F9]/80"
                                : "border-[#CBE9F4] bg-[#D8F1F9]"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <BlueprintToolsIcon />
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[14px] font-medium leading-[1.2] text-[#020202]">
                                  Upload Mechanical Blueprint
                                </span>
                                <span className="text-[12px] font-normal leading-[1.3] text-[#595959]">
                                  PDF, DWG, DXF, STEP (up to 15MB)
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => oemFileInputRef.current?.click()}
                              className="inline-flex h-[36px] shrink-0 items-center justify-center whitespace-nowrap bg-[#020202] px-4 text-[13px] font-medium text-white transition hover:bg-[#58C7E8] hover:text-[#020202]"
                              style={{
                                clipPath:
                                  "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                              }}
                            >
                              Attach Drawing
                            </button>
                          </div>

                          {oemFiles.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {oemFiles.map((file, idx) => (
                                <span
                                  key={`${file.name}-${idx}`}
                                  className="inline-flex items-center gap-2 border border-[#E4E4E4] bg-white px-3 py-1 text-xs text-[#020202]"
                                >
                                  <span className="max-w-[260px] truncate">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOemFiles((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    aria-label={`Remove ${file.name}`}
                                    className="font-bold text-[#595959] hover:text-[#020202]"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Consent Checkbox */}
                        <label className="flex cursor-pointer items-start gap-2.5 select-none">
                          <input
                            type="checkbox"
                            checked={oemForm.consent}
                            onChange={(e) =>
                              setOemForm((prev) => ({ ...prev, consent: e.target.checked }))
                            }
                            className="mt-0.5 h-[16px] w-[16px] shrink-0 rounded-[2px] border border-[#E4E4E4] bg-white accent-[#58C7E8]"
                          />
                          <span className="text-[13px] font-normal leading-[1.3] text-[#595959] sm:text-[14px]">
                            I request engineering review for OEM mass production. I acknowledge
                            CAPCO reserves pilot testing facilities for qualified volume RFQs.
                          </span>
                        </label>

                        {oemError && (
                          <p role="alert" className="text-sm font-medium text-red-600">
                            {oemError}
                          </p>
                        )}

                        {/* Divider Line */}
                        <div className="h-px w-full bg-[#DBDBDB]" />

                        {/* Submit Button */}
                        <div>
                          <button
                            type="submit"
                            className="inline-flex h-[36px] max-w-full items-center justify-between gap-3 whitespace-nowrap bg-[#58C7E8] px-3 text-[13px] font-medium leading-[1.2] text-[#020202] transition hover:bg-[#43b8da] sm:min-w-[265px] sm:gap-4 sm:text-[14px]"
                            style={{
                              clipPath:
                                "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                            }}
                          >
                            <span>Request OEM Technical Quotation</span>
                            <OemEngineerIcon />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-px w-full bg-[#E4E4E4]/50" />

          {/* 4. Global Footprint & Export */}
          <div
            ref={exportSectionRef}
            id="global-export"
            className="scroll-mt-28 flex flex-col items-start gap-8 xl:flex-row xl:items-start xl:gap-[42px]"
          >
            <button
              type="button"
              onClick={() => selectCategory("export")}
              aria-expanded={activeTab === "export"}
              className="group flex cursor-pointer flex-col items-start gap-2 text-left xl:w-[346px] xl:shrink-0"
            >
              <span
                className={`text-[22px] font-medium leading-[1.2] underline underline-offset-[5px] transition sm:text-[26px] lg:text-[28px] xl:whitespace-nowrap ${
                  activeTab === "export"
                    ? "text-[#58C7E8] decoration-[#58C7E8]"
                    : "text-[#020202] decoration-[#020202] group-hover:text-[#58C7E8] group-hover:decoration-[#58C7E8]"
                }`}
              >
                Global Footprint &amp; Export
              </span>
              <span className="text-[16px] font-normal leading-[1.4] text-[#595959] sm:text-[18px]">
                Incoterms, CIF quotes &amp; regional certs
              </span>
            </button>

            {activeTab === "export" && (
              <>
                <div
                  aria-hidden="true"
                  className="hidden xl:flex xl:h-[43px] xl:w-[235px] xl:shrink-0 xl:items-center"
                >
                  <div className="h-[2px] w-full bg-[#F1F1F1]" />
                </div>

                <div
                  className="w-full bg-[#F4F4F4] p-5 sm:p-8 lg:p-[42px] xl:max-w-[1135px] xl:flex-1"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% calc(100% - 42px), calc(100% - 42px) 100%, 0 100%)",
                  }}
                >
                  <div className="flex flex-col gap-7 lg:gap-[38px]">
                    {/* Form Header */}
                    <div className="flex flex-col items-start gap-5 lg:gap-[24px]">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-[18px]">
                        <span
                          className="inline-flex h-[35px] min-w-[185px] items-center justify-center bg-white px-3 text-[13px] font-semibold leading-[1.4] text-[#020202] sm:text-[14px]"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                          }}
                        >
                          INTERNATIONAL EXPORT
                        </span>
                        <span className="h-[26px] w-px bg-[#DBDBDB]" aria-hidden="true" />
                        <span className="text-[13px] font-medium leading-[1.2] text-[#595959] sm:text-[14px]">
                          REF: EXP-GLOB-PORT
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h2 className="text-[22px] font-normal leading-[1.2] text-[#020202] sm:text-[26px]">
                          Request Export Pricing / Samples
                        </h2>
                        <p className="max-w-[1051px] text-[15px] font-normal leading-[1.4] text-[#595959] sm:text-[18px]">
                          Direct export routing serving 15+ destination countries across Middle East,
                          Africa, ASEAN, and Europe. Request FOB/CIF pricing with verified
                          certificate of origin.
                        </p>
                      </div>
                    </div>

                    {exportSubmitted ? (
                      <div className="border border-[#58C7E8] bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#58C7E8]">
                          <span className="h-2 w-2 bg-[#58C7E8]" />
                          Export Proforma Logged • REF: EXP-GLOB-PORT
                        </div>
                        <h3 className="mt-3 text-xl font-medium text-[#020202]">
                          Export proforma inquiry received for {exportForm.importerFirm}.
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#595959]">
                          Our international export cell will prepare your{" "}
                          <strong>{exportForm.incoterm}</strong> quotation for{" "}
                          <strong>{exportForm.portOfDischarge}</strong> (
                          {exportForm.destinationCountry}) and send proforma pricing to{" "}
                          <strong>{exportForm.officialEmail}</strong> within 24 hours.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setExportSubmitted(false);
                            setExportForm({
                              importerFirm: "",
                              procurementManager: "",
                              officialEmail: "",
                              internationalPhone: "",
                              destinationCountry: "",
                              portOfDischarge: "",
                              incoterm: "CIF (Port of Discharge)",
                              paymentInstrument: "Irrevocable LC at Sight",
                              orderVolume: "",
                              certifications: ["GSO / ESMA (GCC Standards)"],
                              packagingNotes: "",
                              consent: false,
                            });
                          }}
                          className="mt-6 inline-flex h-[36px] items-center gap-3 bg-[#58C7E8] px-4 text-[14px] font-medium text-[#020202] transition hover:bg-[#42b8db]"
                          style={{
                            clipPath:
                              "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
                          }}
                        >
                          Submit Another Export Inquiry
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleExportSubmit} noValidate className="flex flex-col gap-5">
                        {/* Row 1: Overseas Importer / Firm & Import / Procurement Manager */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="exp-importer"
                              label="Overseas Importer / Firm"
                              required
                            />
                            <input
                              id="exp-importer"
                              type="text"
                              required
                              placeholder="e.g. Gulf Power Dynamics LLC"
                              value={exportForm.importerFirm}
                              onChange={(e) =>
                                setExportForm((prev) => ({
                                  ...prev,
                                  importerFirm: e.target.value,
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="exp-manager"
                              label="Import / Procurement Manager"
                              required
                            />
                            <input
                              id="exp-manager"
                              type="text"
                              required
                              placeholder="e.g. Tariq Al-Mansoor"
                              value={exportForm.procurementManager}
                              onChange={(e) =>
                                setExportForm((prev) => ({
                                  ...prev,
                                  procurementManager: e.target.value,
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>
                        </div>

                        {/* Row 2: Official Email & International Phone / WhatsApp */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor="exp-email" label="Official Email" required />
                            <input
                              id="exp-email"
                              type="email"
                              required
                              placeholder="trade@gulfpower.ae"
                              value={exportForm.officialEmail}
                              onChange={(e) =>
                                setExportForm((prev) => ({
                                  ...prev,
                                  officialEmail: e.target.value,
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <FieldLabel
                              htmlFor="exp-phone"
                              label="International Phone / WhatsApp"
                              required
                            />
                            <input
                              id="exp-phone"
                              type="tel"
                              required
                              placeholder="+971 50 123 4567"
                              value={exportForm.internationalPhone}
                              onChange={(e) =>
                                setExportForm((prev) => ({
                                  ...prev,
                                  internationalPhone: e.target.value,
                                }))
                              }
                              className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                            />
                          </div>
                        </div>

                        {/* Highlighted Section: PORT & COMMERCIAL TRADE TERMS */}
                        <div className="flex flex-col gap-5 bg-[#D8F1F9] p-4 sm:p-[20px]">
                          <h3 className="text-[14px] font-medium uppercase leading-[1.2] text-[#020202]">
                            PORT &amp; COMMERCIAL TRADE TERMS
                          </h3>

                          {/* Target Destination Country & Port of Discharge / City */}
                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="exp-country"
                                label="Target Destination Country"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="exp-country"
                                  required
                                  value={exportForm.destinationCountry}
                                  onChange={(e) =>
                                    setExportForm((prev) => ({
                                      ...prev,
                                      destinationCountry: e.target.value,
                                    }))
                                  }
                                  className={`h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] focus:border-[#58C7E8] focus:outline-none sm:text-[16px] ${
                                    exportForm.destinationCountry
                                      ? "text-[#020202]"
                                      : "text-[#595959]/50"
                                  }`}
                                >
                                  <option value="">Select Destination Nation</option>
                                  {EXPORT_DESTINATIONS.map((country) => (
                                    <option
                                      key={country}
                                      value={country}
                                      className="text-[#020202]"
                                    >
                                      {country}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="exp-port"
                                label="Port of Discharge / City"
                                required
                              />
                              <input
                                id="exp-port"
                                type="text"
                                required
                                placeholder="e.g. Jebel Ali Port, Dubai or Colombo"
                                value={exportForm.portOfDischarge}
                                onChange={(e) =>
                                  setExportForm((prev) => ({
                                    ...prev,
                                    portOfDischarge: e.target.value,
                                  }))
                                }
                                className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                              />
                            </div>
                          </div>

                          {/* Preferred Incoterm 2020, Payment Instrument, Order Volume */}
                          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="exp-incoterm"
                                label="Preferred Incoterm 2020"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="exp-incoterm"
                                  required
                                  value={exportForm.incoterm}
                                  onChange={(e) =>
                                    setExportForm((prev) => ({
                                      ...prev,
                                      incoterm: e.target.value,
                                    }))
                                  }
                                  className="h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] text-[#020202] focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                                >
                                  {EXPORT_INCOTERMS.map((term) => (
                                    <option key={term} value={term} className="text-[#020202]">
                                      {term}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="exp-payment"
                                label="Payment Instrument"
                                required
                              />
                              <div className="relative">
                                <select
                                  id="exp-payment"
                                  required
                                  value={exportForm.paymentInstrument}
                                  onChange={(e) =>
                                    setExportForm((prev) => ({
                                      ...prev,
                                      paymentInstrument: e.target.value,
                                    }))
                                  }
                                  className="h-[46px] w-full appearance-none border border-[#E4E4E4] bg-white pl-[14px] pr-10 text-[15px] text-[#020202] focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                                >
                                  {EXPORT_PAYMENT_INSTRUMENTS.map((inst) => (
                                    <option key={inst} value={inst} className="text-[#020202]">
                                      {inst}
                                    </option>
                                  ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-[14px] flex items-center">
                                  <ChevronDownIcon />
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <FieldLabel
                                htmlFor="exp-volume"
                                label="Order Volume (Containers/Units)"
                                required
                              />
                              <input
                                id="exp-volume"
                                type="text"
                                required
                                placeholder="e.g. 1x 20ft FCL or 25,000"
                                value={exportForm.orderVolume}
                                onChange={(e) =>
                                  setExportForm((prev) => ({
                                    ...prev,
                                    orderVolume: e.target.value,
                                  }))
                                }
                                className="h-[46px] w-full border border-[#E4E4E4] bg-white px-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                              />
                            </div>
                          </div>

                          {/* Target Destination Inspection / Consular Certification */}
                          <div className="flex flex-col gap-2">
                            <FieldLabel label="Target Destination Inspection / Consular Certification" />
                            <div className="flex flex-wrap gap-3">
                              {EXPORT_CERTIFICATIONS.map((cert) => {
                                const checked = exportForm.certifications.includes(cert);
                                return (
                                  <label
                                    key={cert}
                                    className={`flex h-[39px] cursor-pointer items-center gap-2.5 border px-[14px] transition select-none ${
                                      checked
                                        ? "border-[#58C7E8] bg-white"
                                        : "border-[#E4E4E4] bg-white hover:border-[#58C7E8]"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleExportCertification(cert)}
                                      className="h-[16px] w-[16px] shrink-0 rounded-[2px] border border-[#E4E4E4] bg-white accent-[#58C7E8]"
                                    />
                                    <span className="text-[13px] font-medium leading-[1.4] text-[#020202] sm:text-[14px]">
                                      {cert}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Specific Palletization, Sea-Worthy Packaging or Test Certificate Requirements */}
                        <div className="flex flex-col gap-2">
                          <FieldLabel
                            htmlFor="exp-packaging-notes"
                            label="Specific Palletization, Sea-Worthy Packaging or Test Certificate Requirements"
                          />
                          <textarea
                            id="exp-packaging-notes"
                            rows={4}
                            placeholder="State requirements for fumigated pine pallets, shrink-wrapping, harmonic withstand certifications, or sample consignments..."
                            value={exportForm.packagingNotes}
                            onChange={(e) =>
                              setExportForm((prev) => ({
                                ...prev,
                                packagingNotes: e.target.value,
                              }))
                            }
                            className="h-[104px] w-full resize-y border border-[#E4E4E4] bg-white p-[14px] text-[15px] text-[#020202] placeholder:text-[#595959]/50 focus:border-[#58C7E8] focus:outline-none sm:text-[16px]"
                          />
                        </div>

                        {/* Consent Checkbox */}
                        <label className="flex cursor-pointer items-start gap-2.5 select-none">
                          <input
                            type="checkbox"
                            checked={exportForm.consent}
                            onChange={(e) =>
                              setExportForm((prev) => ({ ...prev, consent: e.target.checked }))
                            }
                            className="mt-0.5 h-[16px] w-[16px] shrink-0 rounded-[2px] border border-[#E4E4E4] bg-white accent-[#58C7E8]"
                          />
                          <span className="text-[13px] font-normal leading-[1.3] text-[#595959] sm:text-[14px]">
                            I agree that export rates are subject to international freight indices
                            and currency hedging. The CAPCO export cell will furnish proforma
                            pricing within 24 hours.
                          </span>
                        </label>

                        {exportError && (
                          <p role="alert" className="text-sm font-medium text-red-600">
                            {exportError}
                          </p>
                        )}

                        {/* Divider Line */}
                        <div className="h-px w-full bg-[#DBDBDB]" />

                        {/* Submit Button */}
                        <div>
                          <button
                            type="submit"
                            className="inline-flex h-[36px] max-w-full items-center justify-between gap-3 whitespace-nowrap bg-[#58C7E8] px-3 text-[13px] font-medium leading-[1.2] text-[#020202] transition hover:bg-[#43b8da] sm:min-w-[265px] sm:gap-4 sm:text-[14px]"
                            style={{
                              clipPath:
                                "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                            }}
                          >
                            <span>Generate Export Proforma Inquiry</span>
                            <FlightTakeoffIcon />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-px w-full bg-[#E4E4E4]/50" />
        </div>
      </section>

      {/* Locations / Plant Facilities Section */}
      <section className="bg-[#121212] px-6 py-16 text-white sm:py-20 lg:px-[60px] lg:py-[100px]">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-10 lg:gap-[60px]">
          {/* Section Heading */}
          <div className="flex flex-col items-start gap-4 lg:gap-[24px]">
            <div className="flex items-center gap-2">
              <span className="h-[6px] w-[6px] shrink-0 bg-[#58C7E8]" />
              <span className="text-[12px] font-medium uppercase leading-none text-white sm:text-[14px]">
                LOCATIONS
              </span>
            </div>
            <h2 className="text-[34px] font-normal leading-none tracking-[-0.04em] text-white sm:text-[42px] lg:text-[48px]">
              Plant Facilities
            </h2>
          </div>

          {/* Aerial Facility Image & Overlay Card */}
          <div className="relative h-[480px] w-full overflow-hidden rounded-[24px] sm:h-[600px] lg:h-[864px] lg:rounded-[32px]">
            <Image
              src="/figma/solutions/plant-facilities-bg.png"
              alt="DADA Energies manufacturing facilities"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10, 10, 10, 0.157) 0%, rgba(10, 10, 10, 0.45) 100%)",
              }}
            />

            {/* Blurred Address Card */}
            <div
              className="absolute bottom-4 left-4 right-4 flex flex-col items-start justify-between gap-6 rounded-[18px] border border-white/10 bg-[#101010]/45 p-6 backdrop-blur-[14px] sm:left-auto sm:right-6 sm:bottom-6 sm:w-[480px] lg:right-[32px] lg:bottom-[32px] lg:w-[560px] lg:gap-[48px] lg:p-[36px]"
              style={{
                backgroundImage: "url('/figma/solutions/c47a2.svg')",
                backgroundSize: "cover",
              }}
            >
              <p className="max-w-[488px] text-[14px] font-normal leading-[1.4] text-white/80 sm:text-[16px]">
                DADA ENERGIES (P) LTD. E54 to E77, TSIIC Automotive Park, Muppireddypally Village,
                Manoharabad Mandal, Medak District, Hyderabad, Telangana - 502336.
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=DADA+ENERGIES+TSIIC+Automotive+Park+Muppireddypally+Telangana+502336"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[52px] w-[280px] max-w-full items-end justify-between bg-white px-3 pb-3 pt-5 text-[13px] font-medium leading-[1.2] !text-[#020202] [&_*]:!text-[#020202] transition hover:brightness-95 sm:h-[56px] sm:text-[14px]"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 12.5px), calc(100% - 12px) 100%, 0 100%)",
                }}
              >
                <span>Get Directions on Google Maps</span>
                <img
                  src="/figma/solutions/38a25.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                />
              </a>
            </div>
          </div>

          {/* Commercial Desk Phone & Department Email Desk */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-[60px]">
            <a
              href="tel:+919848014000"
              className="group flex flex-col items-start justify-center gap-3"
            >
              <span className="text-[14px] font-normal uppercase leading-[1.2] text-white/50 sm:text-[16px]">
                COMMERCIAL DESK PHONE
              </span>
              <div className="flex h-[112px] w-[112px] items-center justify-center rounded-full border border-white/50 transition group-hover:border-[#58C7E8] sm:h-[156px] sm:w-[156px]">
                <img
                  src="/figma/solutions/45042.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[30px] w-[30px] sm:h-[38px] sm:w-[38px]"
                />
              </div>
              <span className="text-[16px] font-normal leading-[1.4] text-white transition group-hover:text-[#58C7E8] sm:text-[18px]">
                +91-9848014000
              </span>
            </a>

            <a
              href="mailto:info@capcocapacitor.com"
              className="group flex flex-col items-start justify-center gap-3"
            >
              <span className="text-[14px] font-normal uppercase leading-[1.2] text-white/50 sm:text-[16px]">
                DEPARTMENT EMAIL DESK
              </span>
              <div className="flex h-[112px] w-[112px] items-center justify-center rounded-full border border-white/50 transition group-hover:border-[#58C7E8] sm:h-[156px] sm:w-[156px]">
                <img
                  src="/figma/solutions/1a3aa.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-[28px] w-[28px] sm:h-[36px] sm:w-[36px]"
                />
              </div>
              <span className="text-[16px] font-normal leading-[1.4] text-white transition group-hover:text-[#58C7E8] sm:text-[18px]">
                info@capcocapacitor.com
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer hidden
        className="border-t border-[#595959]/65 bg-[#121212] bg-cover bg-center px-6 pb-8 pt-14 text-white lg:px-[60px] lg:pb-[32px] lg:pt-[64px]"
        style={{ backgroundImage: "url('/figma/solutions/a62f2.png')" }}
      >
        <div className="mx-auto flex max-w-[1800px] flex-col gap-16 lg:gap-[120px]">
          <div className="flex flex-col justify-between gap-12 xl:flex-row xl:items-start xl:gap-[80px]">
            {/* Newsletter */}
            <div className="w-full max-w-[680px]">
              <h3 className="text-[28px] font-normal leading-[1.15] tracking-[-0.04em] text-white sm:text-[32px]">
                Join our Newsletter
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newsletterEmail.trim()) return;
                  setNewsletterSubscribed(true);
                  setNewsletterEmail("");
                }}
                className="mt-4 flex max-w-[277px] items-center gap-[2px]"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  aria-label="Email address for newsletter"
                  placeholder="Your email"
                  className="h-[40px] w-[190px] min-w-0 flex-1 bg-[#E3E3E3]/20 px-[13px] text-[11px] tracking-[-0.04em] text-white placeholder:text-[#C9C9C9] backdrop-blur-[2.5px] focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-[40px] w-[85px] shrink-0 whitespace-nowrap rounded-[2px] bg-white px-3 text-[11px] font-normal tracking-[-0.04em] text-[#121212] transition hover:bg-[#58C7E8]"
                >
                  Sign Up
                </button>
              </form>
              {newsletterSubscribed && (
                <p className="mt-2 text-xs text-[#58C7E8]">
                  Thank you for subscribing to our newsletter.
                </p>
              )}
            </div>

            {/* Footer Link Columns */}
            <div className="grid w-full max-w-[1040px] grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-y-[120px]">
              {[
                {
                  title: "Company",
                  links: [
                    ["Home", "/"],
                    ["About", "/#why"],
                    ["Gallery", "/#projects"],
                    ["Awards & Achievements", "/#why"],
                    ["Careers", enquiryMailto("Careers")],
                    ["Contact", "/contact"],
                  ],
                },
                {
                  title: "Solutions",
                  links: [
                    ["OEMs", "/solutions/oem"],
                    ["Dealership", "/solutions/dealership"],
                    ["Industrial Enquiry", enquiryMailto("Industrial Enquiry")],
                  ],
                },
                {
                  title: "Global Footprint",
                  links: [
                    "UAE",
                    "USA",
                    "Sri Lanka",
                    "Bangladesh",
                    "Turkey",
                    "African Continent",
                  ].map((label) => [label, enquiryMailto(`${label} enquiry`)]),
                },
                {
                  title: "Media",
                  links: [
                    ["Newsroom", "/#projects"],
                    ["Corporate Social Responsibility", "/#why"],
                    ["Awards", "/#why"],
                    ["Certifications", "/#why"],
                  ],
                },
                {
                  title: "Social",
                  links: ["Instagram", "LinkedIn", "Facebook", "YouTube"].map((label) => [
                    label,
                    enquiryMailto(`${label} contact`),
                  ]),
                },
                {
                  title: "Contact",
                  links: ["Instagram", "LinkedIn", "Facebook", "YouTube"].map((label) => [
                    label,
                    enquiryMailto(`${label} contact`),
                  ]),
                },
              ].map((group) => (
                <div key={group.title} className="flex flex-col gap-4">
                  <p className="text-[14px] font-medium leading-[1.2] tracking-[-0.04em] text-[#595959]">
                    {group.title}
                  </p>
                  <div className="flex flex-col gap-[2px]">
                    {group.links.map(([label, href]) => (
                      <Link
                        key={label}
                        href={href}
                        className="py-0.5 text-[12px] font-normal leading-[1.25] tracking-[-0.04em] text-white transition hover:text-[#58C7E8]"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-start justify-between gap-6 text-[12px] tracking-[-0.04em] text-[#B8B8B8] sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/" aria-label="CAPCO home" className="shrink-0">
              <img
                src="/figma/solutions/caef4.png"
                alt="CAPCO Capacitors"
                width={95}
                height={34}
                className="h-[34px] w-[95px] object-contain"
              />
            </Link>

            <span className="lg:w-[581px]">©2026 Capco Capacitors</span>

            <div className="flex flex-col gap-0.5 text-white">
              <Link href="/privacy-policy" className="transition hover:text-[#58C7E8]">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="transition hover:text-[#58C7E8]">
                Terms &amp; Conditions
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span>All Rights Reserved.</span>
              <span>Website by Asterisk.Inc</span>
            </div>
          </div>
        </div>
      </footer>
      <SiteFooter />
    </main>
  );
}
