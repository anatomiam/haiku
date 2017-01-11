#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import pronouncing as pr
from collections import Counter
import re
import json

def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def nl_split(text, char):

    # split the given text into a list of its sentences, split by every newline
    sentences_nl_split = [sentence.split() for sentence in text.split(char)]

    # for each word in every sentence, remove any special characters from it and lowercase it
    words = [[re.sub('[^A-Za-z0-9]+', '', word).lower() for word in sentence] for sentence in sentences_nl_split]

    # create one single list of all the words separated by a space
    word_list = []
    for line in words:
        if len(line) == 0:
                continue
        else:
            for word in line:
                word_list.append(word)
            word_list.append(' ')

    return word_list

def sounds(words):

    # for each word in a sentence, find its arpabet translation, append them into a single list, assume first phone
    sound_list = []
    for word in words:
        if word == ' ':
            # sound_list.append(word)
            continue
        else:
            sound = pr.phones_for_word(word)
            # if len of sound == 0, it was not recognized as a word in the cmu dictionary
            if len(sound) == 0:
                sound_list.append('*')
            else:
                sound_list.append(sound[0])
    return sound_list

def stresses(sounds):
    # for each sound of every word, find the syllable stress pattern
    stress_list = []
    for sound in sounds:
        if sound == ' ':
            stress_list.append(sound)
        elif sound == '*':
            stress_list.append(sound)
        else:
            stress_list.append(pr.stresses(sound))
    return stress_list


def word_count(words):
    c = dict(Counter(words))
    del c[" "]
    counts = [{"word":key, "count":value} for key, value in c.items()]
    return counts

def phones_count(sounds):
    # count individual sounds in it arpabet word
    individual_sounds = []
    for word in sounds:
        phone = str(word).split()
        for sound in phone:
            individual_sounds.append(sound)
    c = dict(Counter(individual_sounds))
    #convert counter object c into a Json object with a key, value
    sound_json = [{"phone":key, "count":value} for key, value in c.items()]


    return sound_json

def stress_csv(stresses):

    # create csv of stresses
    f = open("stresses.csv", "w")
    for stress in stresses:
        if stress == ' ':
            f.write('\n')
        else:
            f.write(stress + '  ')
    f.close()

def create_json(dict, filename):

    #create a json file of the phones counter
    f = open(filename, "w")
    json.dump(dict, f, sort_keys = True, indent = 4)
    f.close()

def main():
    #get our data as an array from read_in()
    lines = read_in()
    print(nl_split(lines, '\n'))
    
    word = nl_split(lines, '\n')
    sound = sounds(word)
    stress = stresses(sound)
    phone_count = phones_count(sound)
    print(stress)
    counts = word_count(word)
    create_json(counts, "word_count.json")
    stress_csv(stress)
    create_json(phone_count, "phone_count.json")

# Start process
if __name__ == '__main__':
    main()



