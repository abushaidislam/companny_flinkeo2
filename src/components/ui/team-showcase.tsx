import { useState } from 'react';
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram, FaGithub, FaDribbble } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Award, Briefcase, GraduationCap, Calendar } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  location?: string;
  email?: string;
  skills?: string[];
  experience?: { company: string; role: string; period: string }[];
  education?: { school: string; degree: string; year: string }[];
  awards?: string[];
  joinDate?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
    github?: string;
    dribbble?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Visionary creative leader with 12+ years of experience in digital design. Former Design Lead at Google and Adobe. Alex founded Flinke with a mission to make exceptional design accessible to all businesses.',
    location: 'San Francisco, CA',
    email: 'alex@flinke.agency',
    skills: ['UI/UX Design', 'Brand Strategy', 'Creative Direction', 'Team Leadership', 'Figma', 'Adobe CC'],
    experience: [
      { company: 'Google', role: 'Senior Design Lead', period: '2018 - 2022' },
      { company: 'Adobe', role: 'Product Designer', period: '2015 - 2018' },
    ],
    education: [
      { school: 'Rhode Island School of Design', degree: 'MFA in Graphic Design', year: '2015' },
    ],
    awards: ['Awwwards Site of the Day x3', 'CSS Design Awards', 'FWA'],
    joinDate: '2020',
    social: { twitter: '#', linkedin: '#', behance: '#', dribbble: '#' },
  },
  {
    id: '2',
    name: 'Sarah Miller',
    role: 'Lead UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bio: 'Award-winning designer specializing in user-centric interfaces and design systems. Sarah has helped 50+ startups create delightful user experiences that drive growth.',
    location: 'New York, NY',
    email: 'sarah@flinke.agency',
    skills: ['UI Design', 'UX Research', 'Design Systems', 'Prototyping', 'Figma', 'Sketch', 'Principle'],
    experience: [
      { company: 'Spotify', role: 'Senior UI Designer', period: '2019 - 2023' },
      { company: 'Uber', role: 'Product Designer', period: '2017 - 2019' },
    ],
    education: [
      { school: 'Parsons School of Design', degree: 'BFA in Communication Design', year: '2017' },
    ],
    awards: ['Red Dot Design Award', 'IF Design Award'],
    joinDate: '2021',
    social: { twitter: '#', linkedin: '#', dribbble: '#' },
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    role: 'Senior Full-Stack Developer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'Full-stack architect with expertise in React, Node.js, and cloud infrastructure. Marcus builds scalable, high-performance web applications that power businesses worldwide.',
    location: 'Austin, TX',
    email: 'marcus@flinke.agency',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Next.js'],
    experience: [
      { company: 'Netflix', role: 'Senior Frontend Engineer', period: '2019 - 2023' },
      { company: 'Shopify', role: 'Full-Stack Developer', period: '2016 - 2019' },
    ],
    education: [
      { school: 'MIT', degree: 'BS in Computer Science', year: '2016' },
    ],
    awards: ['GitHub Star', 'Stack Overflow Top Contributor'],
    joinDate: '2021',
    social: { twitter: '#', linkedin: '#', github: '#' },
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    role: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    bio: 'Certified Scrum Master and Agile expert. Emma has successfully delivered 100+ projects on time and on budget, ensuring seamless communication between clients and our team.',
    location: 'Miami, FL',
    email: 'emma@flinke.agency',
    skills: ['Agile/Scrum', 'Project Management', 'Client Relations', 'Risk Management', 'Jira', 'Notion'],
    experience: [
      { company: 'Deloitte Digital', role: 'Senior Project Manager', period: '2018 - 2022' },
      { company: 'IBM', role: 'Project Coordinator', period: '2015 - 2018' },
    ],
    education: [
      { school: 'University of Florida', degree: 'MBA', year: '2015' },
    ],
    awards: ['PMI Project Management Professional (PMP)', 'Certified ScrumMaster (CSM)'],
    joinDate: '2022',
    social: { linkedin: '#' },
  },
  {
    id: '5',
    name: 'David Kim',
    role: 'Senior Designer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Brand and visual identity specialist. David creates memorable brand experiences that resonate with audiences and stand the test of time.',
    location: 'Seattle, WA',
    email: 'david@flinke.agency',
    skills: ['Brand Identity', 'Visual Design', 'Typography', 'Illustration', 'Adobe Illustrator', 'Photoshop'],
    experience: [
      { company: 'Pentagram', role: 'Designer', period: '2019 - 2023' },
      { company: 'Collins', role: 'Junior Designer', period: '2017 - 2019' },
    ],
    education: [
      { school: 'ArtCenter College of Design', degree: 'BFA in Graphic Design', year: '2017' },
    ],
    joinDate: '2022',
    social: { twitter: '#', linkedin: '#', instagram: '#' },
  },
  {
    id: '6',
    name: 'Jessica Park',
    role: 'Marketing Lead',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    bio: 'Digital marketing strategist with expertise in growth marketing, SEO, and content strategy. Jessica drives measurable results for our clients.',
    location: 'Los Angeles, CA',
    email: 'jessica@flinke.agency',
    skills: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Analytics', 'Google Ads', 'HubSpot'],
    experience: [
      { company: 'HubSpot', role: 'Marketing Manager', period: '2019 - 2023' },
      { company: 'Airbnb', role: 'Growth Marketing Specialist', period: '2017 - 2019' },
    ],
    education: [
      { school: 'USC', degree: 'BS in Business Administration', year: '2017' },
    ],
    awards: ['Google Analytics Certified', 'HubSpot Inbound Certified'],
    joinDate: '2022',
    social: { linkedin: '#', instagram: '#' },
  },
  {
    id: '7',
    name: 'Michael Torres',
    role: 'Backend Developer',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80',
    bio: 'Database and API architecture expert. Michael builds robust backend systems that power complex applications with reliability and speed.',
    location: 'Denver, CO',
    email: 'michael@flinke.agency',
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'AWS Lambda', 'Docker', 'Kubernetes'],
    experience: [
      { company: 'Stripe', role: 'Backend Engineer', period: '2020 - 2023' },
      { company: 'Twilio', role: 'Software Engineer', period: '2018 - 2020' },
    ],
    education: [
      { school: 'UC Berkeley', degree: 'BS in Computer Science', year: '2018' },
    ],
    joinDate: '2023',
    social: { linkedin: '#', github: '#' },
  },
  {
    id: '8',
    name: 'Lisa Wong',
    role: 'Motion Designer',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    bio: 'Animation and motion graphics specialist. Lisa brings interfaces to life with delightful micro-interactions and compelling visual storytelling.',
    location: 'Portland, OR',
    email: 'lisa@flinke.agency',
    skills: ['Motion Design', 'After Effects', 'Lottie', 'Cinema 4D', 'Principle', 'Framer'],
    experience: [
      { company: 'R/GA', role: 'Motion Designer', period: '2019 - 2023' },
      { company: 'Buck', role: 'Junior Motion Designer', period: '2017 - 2019' },
    ],
    education: [
      { school: 'CalArts', degree: 'BFA in Character Animation', year: '2017' },
    ],
    awards: ['Motion Awards Finalist'],
    joinDate: '2023',
    social: { instagram: '#', dribbble: '#' },
  },
];

interface TeamShowcaseProps {
  members?: TeamMember[];
}

export default function TeamShowcase({ members = DEFAULT_MEMBERS }: TeamShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <>
      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-10 lg:gap-14 select-none w-full max-w-5xl mx-auto py-8 px-4 md:px-6 font-sans">
        {/* ── Left: photo grid ── */}
        <div className="flex gap-2 md:gap-3 flex-shrink-0 overflow-x-auto pb-1 md:pb-0">
          {/* Column 1 */}
          <div className="flex flex-col gap-2 md:gap-3">
            {col1.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[110px] h-[120px] sm:w-[130px] sm:h-[140px] md:w-[155px] md:h-[165px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2 md:gap-3 mt-[48px] sm:mt-[56px] md:mt-[68px]">
            {col2.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[122px] h-[132px] sm:w-[145px] sm:h-[155px] md:w-[172px] md:h-[182px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-2 md:gap-3 mt-[22px] sm:mt-[26px] md:mt-[32px]">
            {col3.map((member) => (
              <PhotoCard
                key={member.id}
                member={member}
                className="w-[115px] h-[125px] sm:w-[136px] sm:h-[146px] md:w-[162px] md:h-[172px]"
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </div>
        </div>

        {/* ── Right: member name list*/}
        <div className="flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-col gap-4 md:gap-5 pt-0 md:pt-2 flex-1 w-full">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onClick={() => setSelectedMember(member)}
            />
          ))}
        </div>
      </div>

      {/* Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedMember.name}</DialogTitle>
                    <DialogDescription className="text-primary font-medium">
                      {selectedMember.role}
                    </DialogDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      {selectedMember.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedMember.location}
                        </span>
                      )}
                      {selectedMember.joinDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {selectedMember.joinDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Bio */}
                <p className="text-muted-foreground leading-relaxed">{selectedMember.bio}</p>

                {/* Skills */}
                {selectedMember.skills && selectedMember.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedMember.experience && selectedMember.experience.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Experience
                    </h4>
                    <div className="space-y-3">
                      {selectedMember.experience.map((exp, idx) => (
                        <div key={idx} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{exp.role}</p>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{exp.period}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {selectedMember.education && selectedMember.education.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </h4>
                    <div className="space-y-3">
                      {selectedMember.education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{edu.degree}</p>
                            <p className="text-sm text-muted-foreground">{edu.school}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{edu.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards */}
                {selectedMember.awards && selectedMember.awards.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Awards & Recognition
                    </h4>
                    <ul className="space-y-1">
                      {selectedMember.awards.map((award, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Social & Contact */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                  {selectedMember.email && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${selectedMember.email}`} className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact
                      </a>
                    </Button>
                  )}
                  {selectedMember.social?.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={selectedMember.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selectedMember.social?.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={selectedMember.social.twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selectedMember.social?.github && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={selectedMember.social.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selectedMember.social?.dribbble && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={selectedMember.social.dribbble} target="_blank" rel="noopener noreferrer">
                        <FaDribbble className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {selectedMember.social?.instagram && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={selectedMember.social.instagram} target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ─────────────────────────────────────────
   Photo card 
───────────────────────────────────────── */

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
  onClick,
}: {
  member: TeamMember;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl cursor-pointer flex-shrink-0 transition-opacity duration-400',
        className,
        isDimmed ? 'opacity-60' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover transition-[filter] duration-500"
        style={{
          filter: isActive ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.77)',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Member name section
───────────────────────────────────────── */

function MemberRow({
  member,
  hoveredId,
  onHover,
  onClick,
}: {
  member: TeamMember;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) {
  const isActive = hoveredId === member.id;
  const isDimmed = hoveredId !== null && !isActive;
  const hasSocial = member.social?.twitter ?? member.social?.linkedin ?? member.social?.instagram ?? member.social?.behance;

  return (
    <div
      className={cn(
        'cursor-pointer transition-opacity duration-300',
        isDimmed ? 'opacity-50' : 'opacity-100',
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Name + social*/}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'w-4 h-3 rounded-[5px] flex-shrink-0 transition-all duration-300',
            isActive ? 'bg-foreground w-5' : 'bg-foreground/25',
          )}
        />
        <span
          className={cn(
            'text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300',
            isActive ? 'text-foreground' : 'text-foreground/80',
          )}
        >
          {member.name}
        </span>

        {/* Social icons */}
        {hasSocial && (
          <div
            className={cn(
              'flex items-center gap-1.5 ml-0.5 transition-all duration-200',
              isActive
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-2 pointer-events-none',
            )}
          >
            {member.social?.twitter && (
              <a
                href={member.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-150 hover:scale-110"
                title="X / Twitter"
              >
                <FaTwitter size={10} />
              </a>
            )}
            {member.social?.linkedin && (
              <a
                href={member.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-150 hover:scale-110"
                title="LinkedIn"
              >
                <FaLinkedinIn size={10} />
              </a>
            )}
            {member.social?.github && (
              <a
                href={member.social.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-150 hover:scale-110"
                title="GitHub"
              >
                <FaGithub size={10} />
              </a>
            )}
            {member.social?.dribbble && (
              <a
                href={member.social.dribbble}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-150 hover:scale-110"
                title="Dribbble"
              >
                <FaDribbble size={10} />
              </a>
            )}
            {member.social?.instagram && (
              <a
                href={member.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-150 hover:scale-110"
                title="Instagram"
              >
                <FaInstagram size={10} />
              </a>
            )}
            {member.social?.behance && (
              <a
                href={member.social.behance}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all duration-150 hover:scale-110"
                title="Behance"
              >
                <FaBehance size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Role */}
      <p className="mt-1.5 pl-[27px] text-[7px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {member.role}
      </p>
    </div>
  );
}
